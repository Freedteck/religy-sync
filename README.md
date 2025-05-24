# Religy Sync ✨

A Web3-powered faith-based Q&A and insight platform

## ✨ Overview

**Religy Sync** is a decentralized platform that empowers users to explore and share faith-based knowledge. It bridges seekers with verified scholars, enabling structured discussions around spiritual questions, prayers, and insights — all securely stored on-chain as NFTs.

Built on **Sui Move** and integrated with **zkLogin**, Religy Sync ensures inclusivity, authenticity, and ownership of religious content in the Web3 era.

---

## Features

- **Scholar Verification**: On-chain verification of scholars to ensure authentic answers.
- **Ask & Answer**: Post religious questions and get structured answers from verified scholars.
- **Prayers & Insights**: Share personal prayers or publish insights/teachings (text, audio, or video).
- **Follow-ups & Clarifications**: Continue discussions through follow-ups and get deeper clarifications.
- **SUI-based Tipping**: Reward meaningful contributions using the native SUI token.
- **zkLogin Support**: Seamless, passwordless user onboarding with zkLogin.
- **On-chain Identity & NFTs**: All content is minted as NFTs to preserve authorship and originality.
- **Reputation & Rewards**: Scholars and users build reputation and can earn rewards based on impact.

---

## Screenshots

> _(Add relevant screenshots of the platform UI here — homepage, Q&A thread, scholar dashboard, etc.)_

---

## Tech Stack

| Layer                  | Tech                                                         |
| ---------------------- | ------------------------------------------------------------ |
| **Smart Contract**     | Sui Move                                                     |
| **Frontend**           | React (Vite) + CSS Modules                                   |
| **Wallet Integration** | Sui Wallet, zkLogin (Enoki)                                  |
| **Storage**            | Walrus decentralized                                         |
| **Design Focus**       | Modern, clean UI/UX optimized for clarity and spiritual tone |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Sui CLI](https://docs.sui.io/sui-cli)
- [Sui Wallet](https://docs.sui.io/wallet)
- Testnet faucet for SUI tokens

---

### 1. Clone the Repository

```bash
git clone https://github.com/Freedteck/religy-sync.git
cd religy-sync
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Add Environment variables

Add a `.env.local` to the root of frontend and paste this:

```bash
VITE_ENOKI_PUBLIC_API_KEY=<YOUR_ENOKI_PUBLIC_API_KEY>
VITE_GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
VITE_FACEBOOK_APP_ID=<YOUR_FACEBOOK_APP_ID>
```

## Contract Overview

Main module: `religy_sync::religy_sync`

### Key Functions:

- `apply_for_scholar()`
- `create_question()`
- `create_prayer()`
- `create_answer()`
- `create_insight()`
- `create_followup()`
- `create_clarification()`
- `like_content()`
- `send_reward()`
- `review_scholar_application()`
- `verify_scholar()`
- `revoke_scholar()`

### Views

- `is_scholar()`
- `get_application_details()`

Live url: [https://religy-sync.vercel.app/](https://religy-sync.vercel.app/)

Pitch: [ReligySync.pdf](./pitch/ReligySync.pdf)
