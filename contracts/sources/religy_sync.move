/*
/// Module: contracts
module contracts::contracts;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions

module religy_sync::religy_sync;

// === Imports ===
use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui::table::{Self, Table};
use sui::event;
use sui::package;
use sui::display;
use std::string::{Self, String};

// === Errors ===
// const ENotOwner: u64 = 0;
// const ENotScholar: u64 = 1;
// const ENotAdmin: u64 = 2;
// const EContentNotFound: u64 = 3;
const EInvalidContentType: u64 = 4;
const EInvalidReward: u64 = 5;
const EAlreadyLiked: u64 = 6;
const ENotOriginalAsker: u64 = 7;
const ENotOriginalAnswerer: u64 = 8;
const EApplicationExists: u64 = 9;
const EApplicationNotFound: u64 = 10;

// === Constants ===
// Content types
const QUESTION_TYPE: u8 = 0;
const ANSWER_TYPE: u8 = 1;
const INSIGHT_TYPE: u8 = 2;
const PRAYER_TYPE: u8 = 3;
const FOLLOWUP_TYPE: u8 = 4;
const CLARIFICATION_TYPE: u8 = 5;

// Application status
const APPLICATION_PENDING: u8 = 0;
const APPLICATION_APPROVED: u8 = 1;
const APPLICATION_REJECTED: u8 = 2;

// === Structs ===
/// One-Time Witness for the package
public struct RELIGY_SYNC has drop {}

// Capability for the platform administrator
public struct AdminCap has key, store {
    id: UID
}

// Capability for verified scholars
public struct ScholarCap has key, store {
    id: UID,
    scholar_address: address,
    credentials: String,     // Credentials or qualifications of the scholar
    faith_tradition: String, // The religious tradition the scholar is verified for
    verified_at: u64,        // Timestamp when verification occurred
}

// The main platform state object
public struct Platform has key {
    id: UID,
    content_count: u64,
    admin: address,
    scholars: Table<address, bool>, // Mapping of verified scholars
    scholar_applications: Table<address, ScholarApplication>, // Pending scholar applications
}

// Scholar application
public struct ScholarApplication has store {
    applicant: address,
    name: String,
    credentials: String,
    faith_tradition: String,
    additional_info: String,
    status: u8,               // 0: pending, 1: approved, 2: rejected
    applied_at: u64,
    reviewed_at: Option<u64>,
}

// Content NFT - represents questions, answers, insights, prayers, and followups
public struct Content has key, store {
    id: UID,
    content_type: u8,        // 0: question, 1: answer, 2: insight, 3: prayer, 4: followup, 5: clarification
    creator: address,        // Creator of the content
    title: String,           // Title/headline of the content
    body: String,            // Main content body
    metadata: String,        // Additional metadata (JSON format)
    related_to: Option<ID>,  // ID of related content (e.g., answer relates to question)
    likes: u64,              // Number of likes
    created_at: u64,         // Timestamp of creation
    likers: vector<address>, // Addresses who have liked this content
}

// === Events ===
public struct ContentCreated has copy, drop {
    content_id: ID,
    content_type: u8,
    creator: address,
    title: String,
    timestamp: u64,
    related_to: Option<ID>,
}

public struct ContentLiked has copy, drop {
    content_id: ID,
    liker: address,
    total_likes: u64,
}

public struct RewardSent has copy, drop {
    content_id: ID,
    sender: address,
    receiver: address,
    amount: u64,
}

public struct ScholarVerified has copy, drop {
    scholar: address,
    faith_tradition: String,
    timestamp: u64,
}

public struct ScholarApplicationSubmitted has copy, drop {
    applicant: address,
    faith_tradition: String,
    timestamp: u64,
}

public struct ScholarApplicationReviewed has copy, drop {
    applicant: address,
    status: u8,
    timestamp: u64,
}

// === Package Functions ===

// One-time initialization function
fun init(witness: RELIGY_SYNC, ctx: &mut TxContext) {
    // Create admin capability and transfer to transaction sender
    let admin_cap = AdminCap {
        id: object::new(ctx)
    };
    transfer::transfer(admin_cap, tx_context::sender(ctx));

    // Create the main platform object
    let platform = Platform {
        id: object::new(ctx),
        content_count: 0,
        admin: tx_context::sender(ctx),
        scholars: table::new(ctx),
        scholar_applications: table::new(ctx),
    };
    transfer::share_object(platform);

    // Set up NFT display
    let publisher = package::claim(witness, ctx);
    let mut display_config = display::new_with_fields<Content>(
        &publisher,
        vector[
            string::utf8(b"name"),
            string::utf8(b"description"),
            string::utf8(b"image_url"),
            string::utf8(b"creator"),
            string::utf8(b"content_type"),
        ],
        vector[
            string::utf8(b"{title}"),
            string::utf8(b"{body}"),
            string::utf8(b"https://faith-platform.io/content/{id}"),
            string::utf8(b"{creator}"),
            string::utf8(b"{content_type}"),
        ],
        ctx
    );
    display::update_version(&mut display_config);
    transfer::public_transfer(publisher, tx_context::sender(ctx));
    transfer::public_transfer(display_config, tx_context::sender(ctx));
}

// === Public Functions ===

// Submit a scholar application
public entry fun apply_for_scholar(
    platform: &mut Platform,
    name: vector<u8>,
    credentials: vector<u8>,
    faith_tradition: vector<u8>,
    additional_info: vector<u8>,
    ctx: &mut TxContext
) {
    let applicant = tx_context::sender(ctx);
    
    // Check if application already exists
    assert!(!table::contains(&platform.scholar_applications, applicant), EApplicationExists);
    
    // Create and store the application
    let application = ScholarApplication {
        applicant,
        name: string::utf8(name),
        credentials: string::utf8(credentials),
        faith_tradition: string::utf8(faith_tradition),
        additional_info: string::utf8(additional_info),
        status: APPLICATION_PENDING,
        applied_at: tx_context::epoch(ctx),
        reviewed_at: option::none(),
    };
    
    table::add(&mut platform.scholar_applications, applicant, application);
    
    // Emit event
    event::emit(ScholarApplicationSubmitted {
        applicant,
        faith_tradition: string::utf8(faith_tradition),
        timestamp: tx_context::epoch(ctx),
    });
}

// Create a question (anyone can create)
public entry fun create_question(
    platform: &mut Platform,
    title: vector<u8>,
    body: vector<u8>,
    metadata: vector<u8>,
    ctx: &mut TxContext
) {
    create_content_internal(
        platform,
        QUESTION_TYPE,
        title,
        body,
        metadata,
        option::none(),
        ctx
    );
}

// Create a prayer (anyone can create)
public entry fun create_prayer(
    platform: &mut Platform,
    title: vector<u8>,
    body: vector<u8>,
    metadata: vector<u8>,
    ctx: &mut TxContext
) {
    create_content_internal(
        platform,
        PRAYER_TYPE,
        title,
        body,
        metadata,
        option::none(),
        ctx
    );
}

// Create an answer (verified scholars only)
public entry fun create_answer(
    _: &ScholarCap,
    platform: &mut Platform,
    question_id: ID,
    title: vector<u8>,
    body: vector<u8>,
    metadata: vector<u8>,
    ctx: &mut TxContext
) {
    create_content_internal(
        platform,
        ANSWER_TYPE,
        title,
        body,
        metadata,
        option::some(question_id),
        ctx
    );
}

// Create an insight/teaching (verified scholars only)
public entry fun create_insight(
    _: &ScholarCap,
    platform: &mut Platform,
    title: vector<u8>,
    body: vector<u8>,
    metadata: vector<u8>,
    ctx: &mut TxContext
) {
    create_content_internal(
        platform,
        INSIGHT_TYPE,
        title,
        body,
        metadata,
        option::none(),
        ctx
    );
}

// Create a follow-up question (original asker only)
public entry fun create_followup(
    platform: &mut Platform,
    answer_id: ID,
    original_question: &Content,
    title: vector<u8>,
    body: vector<u8>,
    metadata: vector<u8>,
    ctx: &mut TxContext
) {
    // Verify caller is the original question asker
    let sender = tx_context::sender(ctx);
    assert!(sender == original_question.creator, ENotOriginalAsker);
    assert!(original_question.content_type == QUESTION_TYPE, EInvalidContentType);
    
    create_content_internal(
        platform,
        FOLLOWUP_TYPE,
        title,
        body,
        metadata,
        option::some(answer_id), // Follow-up relates to the answer
        ctx
    );
}

// Create a clarification (original answerer only)
public entry fun create_clarification(
    _: &ScholarCap,
    platform: &mut Platform,
    followup_id: ID,
    original_answer: &Content,
    title: vector<u8>,
    body: vector<u8>,
    metadata: vector<u8>,
    ctx: &mut TxContext
) {
    // Verify caller is the original answerer
    let sender = tx_context::sender(ctx);
    assert!(sender == original_answer.creator, ENotOriginalAnswerer);
    assert!(original_answer.content_type == ANSWER_TYPE, EInvalidContentType);
    
    create_content_internal(
        platform,
        CLARIFICATION_TYPE,
        title,
        body,
        metadata,
        option::some(followup_id), // Clarification relates to the follow-up
        ctx
    );
}

// Like a content
public entry fun like_content(
    content: &mut Content,
    ctx: &mut TxContext
) {
    let sender = tx_context::sender(ctx);
    
    // Check if user has already liked this content
    let (found, _) = vector::index_of(&content.likers, &sender);
    assert!(!found, EAlreadyLiked);
    
    // Add user to likers and increment like count
    vector::push_back(&mut content.likers, sender);
    content.likes = content.likes + 1;
    
    // Emit like event
    event::emit(ContentLiked {
        content_id: object::id(content),
        liker: sender,
        total_likes: content.likes,
    });
}

// Send a reward/tip to content creator
public entry fun send_reward(
    content: &Content,
    payment: Coin<SUI>,
    ctx: &mut TxContext
) {
    let sender = tx_context::sender(ctx);
    let receiver = content.creator;
    let amount = coin::value(&payment);
    
    // Ensure reward amount is valid
    assert!(amount > 0, EInvalidReward);
    
    // Transfer payment to content creator
    transfer::public_transfer(payment, receiver);
    
    // Emit reward event
    event::emit(RewardSent {
        content_id: object::id(content),
        sender,
        receiver,
        amount,
    });
}

// === Admin Functions ===

// Review a scholar application (admin only)
public entry fun review_scholar_application(
    _: &AdminCap,
    platform: &mut Platform,
    applicant: address,
    approve: bool,
    ctx: &mut TxContext
) {
    // Ensure application exists
    assert!(table::contains(&platform.scholar_applications, applicant), EApplicationNotFound);
    
    // Get and update application
    let application = table::borrow_mut(&mut platform.scholar_applications, applicant);
    application.status = if (approve) APPLICATION_APPROVED else APPLICATION_REJECTED;
    application.reviewed_at = option::some(tx_context::epoch(ctx));
    
    // If approved, verify the scholar
    if (approve) {
        // Add to scholars table
        table::add(&mut platform.scholars, applicant, true);
        
        // Create scholar capability
        let scholar_cap = ScholarCap {
            id: object::new(ctx),
            scholar_address: applicant,
            credentials: application.credentials,
            faith_tradition: application.faith_tradition,
            verified_at: tx_context::epoch(ctx),
        };
        
        // Transfer the capability to the scholar
        transfer::transfer(scholar_cap, applicant);
        
        // Emit verification event
        event::emit(ScholarVerified {
            scholar: applicant,
            faith_tradition: application.faith_tradition,
            timestamp: tx_context::epoch(ctx),
        });
    };
    
    // Emit review event
    event::emit(ScholarApplicationReviewed {
        applicant,
        status: application.status,
        timestamp: tx_context::epoch(ctx),
    });
}

// Verify a scholar directly (admin only) - for backward compatibility
public entry fun verify_scholar(
    _: &AdminCap,
    platform: &mut Platform,
    scholar_address: address,
    credentials: vector<u8>,
    faith_tradition: vector<u8>,
    ctx: &mut TxContext
) {
    // Register scholar in the platform
    table::add(&mut platform.scholars, scholar_address, true);
    
    // Create scholar capability
    let scholar_cap = ScholarCap {
        id: object::new(ctx),
        scholar_address,
        credentials: string::utf8(credentials),
        faith_tradition: string::utf8(faith_tradition),
        verified_at: tx_context::epoch(ctx),
    };
    
    // Transfer the capability to the scholar
    transfer::transfer(scholar_cap, scholar_address);
    
    // Emit event
    event::emit(ScholarVerified {
        scholar: scholar_address,
        faith_tradition: string::utf8(faith_tradition),
        timestamp: tx_context::epoch(ctx),
    });
}

// Revoke scholar verification (admin only)
public entry fun revoke_scholar(
    _: &AdminCap,
    platform: &mut Platform,
    scholar_address: address
) {
    table::remove(&mut platform.scholars, scholar_address);
}

// === View Functions ===

// Check if an address is a verified scholar
public fun is_scholar(platform: &Platform, address: address): bool {
    table::contains(&platform.scholars, address)
}

// Get application details (publicly readable)
public fun get_application_details(
    platform: &Platform, 
    applicant: address
): (String, String, String, String, u8, u64, Option<u64>) {
    let app = table::borrow(&platform.scholar_applications, applicant);
    (
        app.name,
        app.credentials,
        app.faith_tradition,
        app.additional_info,
        app.status,
        app.applied_at,
        app.reviewed_at
    )
}

// Get content information
public fun get_content_info(content: &Content): (u8, address, String, String, u64) {
    (content.content_type, content.creator, content.title, content.body, content.likes)
}

// Get the number of content items created on the platform
public fun get_content_count(platform: &Platform): u64 {
    platform.content_count
}

// Get related content ID if it exists
public fun get_related_content_id(content: &Content): Option<ID> {
    content.related_to
}

// Get content metadata
public fun get_content_metadata(content: &Content): String {
    content.metadata
}

// Check if user has already liked a content
public fun has_liked(content: &Content, user: address): bool {
    let (found, _) = vector::index_of(&content.likers, &user);
    found
}

// Get content creation timestamp
public fun get_content_timestamp(content: &Content): u64 {
    content.created_at
}

// === Private Functions ===

#[allow(lint(self_transfer))]
// Internal function to create content
fun create_content_internal(
    platform: &mut Platform,
    content_type: u8,
    title: vector<u8>,
    body: vector<u8>,
    metadata: vector<u8>,
    related_to: Option<ID>,
    ctx: &mut TxContext
) {
    // Increment content counter
    platform.content_count = platform.content_count + 1;
    
    // Create content object
    let content = Content {
        id: object::new(ctx),
        content_type,
        creator: tx_context::sender(ctx),
        title: string::utf8(title),
        body: string::utf8(body),
        metadata: string::utf8(metadata),
        related_to,
        likes: 0,
        created_at: tx_context::epoch(ctx),
        likers: vector::empty(),
    };
    
    let content_id = object::id(&content);
    
    // Transfer content as NFT to creator
    transfer::transfer(content, tx_context::sender(ctx));
    
    // Emit content creation event
    event::emit(ContentCreated {
        content_id,
        content_type,
        creator: tx_context::sender(ctx),
        title: string::utf8(title),
        timestamp: tx_context::epoch(ctx),
        related_to,
    });
}

