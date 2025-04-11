import React, { useState } from "react";
import styles from "./Profile.module.css";

// Mock data for the profile
const scholarData = {
  name: "Venerable Sumedho",
  initials: "VS",
  wallet: "0x6f32...8a9b",
  specialty: "Buddhism • Theravada Tradition • Ajahn Chah Lineage",
  stats: {
    answers: 143,
    votes: "2.8k",
    rewards: 528,
  },
};

// Mock data for answers
const answersData = [
  {
    id: 1,
    question: "What is the significance of meditation in Buddhist practice?",
    answer:
      "In Buddhism, meditation (bhāvanā) is not merely about stress reduction but is a core practice for developing wisdom and compassion. There are two main types: Samatha (concentration) which calms the mind, and Vipassana (insight) which develops clear seeing into the nature of reality. Unlike secular mindfulness, Buddhist meditation is part of the Noble Eightfold Path, specifically Right Mindfulness and Right Concentration. The ultimate aim is to see the three characteristics of existence: impermanence (anicca), unsatisfactoriness (dukkha), and non-self (anatta), which leads to Nibbana (liberation).",
    votes: 24,
    time: "1 hour ago",
  },
  {
    id: 2,
    question: "How does Theravada Buddhism differ from Mahayana Buddhism?",
    answer:
      "Theravada Buddhism focuses on the individual's path to liberation through becoming an arahant, while Mahayana emphasizes the bodhisattva ideal of helping all beings attain liberation. Theravada adheres closely to the Pali Canon as its primary scripture, considering it to contain the original teachings of the Buddha, while Mahayana includes additional sutras. Regarding practice, Theravada emphasizes meditation and monastic discipline as the primary path, while Mahayana encompasses a wider range of practices including visualization, mantra recitation, and devotional practices.",
    votes: 32,
    time: "2 days ago",
  },
  {
    id: 3,
    question: "What is the Buddhist perspective on suffering?",
    answer:
      'In Buddhism, suffering (dukkha) is the first of the Four Noble Truths taught by the Buddha. The term dukkha encompasses a broader meaning than the English word "suffering" - it includes dissatisfaction, stress, and the inherent unsatisfactoriness of conditioned existence. The Buddha taught that suffering arises from craving (tanha) and ignorance (avijja) about the true nature of reality. By understanding the causes of suffering through wisdom and mindfulness, we can follow the Eightfold Path to its cessation, leading to Nibbana.',
    votes: 47,
    time: "5 days ago",
  },
];

// Mock data for credentials
const credentialsData = [
  {
    title: "Monastic Ordination",
    issuer: "Wat Pah Nanachat, Thailand",
    content:
      "Full bhikkhu ordination in the Theravada tradition under the lineage of Ajahn Chah. Has maintained unbroken precepts for over 25 years as a fully ordained monk in the Thai Forest Tradition.",
    verifications: 3,
  },
  {
    title: "Dharma Teaching Qualification",
    issuer: "International Buddhist Council",
    content:
      "Authorized to teach the Dhamma according to the Theravada tradition. Has completed the required study of Vinaya, Suttas, and Abhidhamma, and has demonstrated proficiency in guiding meditation retreats and giving Dhamma talks.",
    verifications: 5,
  },
  {
    title: "Pali Language Proficiency",
    issuer: "Mahachulalongkornrajavidyalaya University",
    content:
      "Advanced proficiency in Pali language, the canonical language of Theravada Buddhism. Capable of working directly with original Pali texts and providing nuanced translations and interpretations of the Buddha's teachings.",
    verifications: 2,
  },
];

// Additional academic credentials
const additionalCredentials = [
  {
    title: "PhD in Buddhist Studies",
    issuer: "University of Oxford",
    content:
      "Doctoral research focused on the comparative analysis of early Buddhist texts and their practical applications in contemporary mindfulness practices. Dissertation received commendation for bridging scholarly research with applied contemplative techniques.",
    verifications: 4,
  },
  {
    title: "Visiting Scholar",
    issuer: "Mind & Life Institute",
    content:
      "Contributed to interdisciplinary research on the effects of long-term meditation practice on neuroplasticity and emotional regulation. Participated in dialogue sessions with neuroscientists and contemplative practitioners.",
    verifications: 3,
  },
];

// Mock data for about section
const aboutData = {
  biography: [
    "Venerable Sumedho has been a Buddhist monk in the Theravada tradition for over 25 years. Originally from the United States, he traveled to Thailand in his twenties and was ordained at Wat Pah Nanachat, the International Forest Monastery established by Ajahn Chah for non-Thai disciples.",
    "After spending 15 years training in various forest monasteries throughout Thailand, he established a small meditation center in the western United States where he teaches meditation and Buddhist philosophy. His approach emphasizes practical application of the Buddha's teachings in daily life, with a focus on mindfulness, ethical conduct, and direct investigation of experience.",
    "Venerable Sumedho is known for his accessible teaching style that bridges traditional Theravada Buddhism with contemporary Western understanding. He has authored three books on Buddhist practice and leads regular meditation retreats both online and in-person.",
  ],
  focus: [
    "Vipassana (Insight) Meditation",
    "Early Buddhist Suttas",
    "Integrating Buddhist practice into lay life",
    "Buddhist ethics in the modern world",
    "Environmental awareness through Buddhist principles",
  ],
  publications: [
    "The Middle Way: Finding Balance in an Age of Extremes (2018)",
    "Mindfulness: Ancient Wisdom for Modern Times (2015)",
    "The Four Noble Truths in Daily Life (2010)",
  ],
  languages: [
    "English (native)",
    "Thai (fluent)",
    "Pali (scholarly proficiency)",
    "Sanskrit (reading knowledge)",
  ],
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState("answers");

  return (
    <main className={styles.profile}>
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <div className={styles.profileAvatar}>{scholarData.initials}</div>
        <div className={styles.profileInfo}>
          <h1>{scholarData.name}</h1>
          <div className={styles.profileMeta}>
            <div className={styles.verifiedBadge}>Verified Scholar</div>
            <div className={styles.profileWallet}>{scholarData.wallet}</div>
          </div>
          <p>{scholarData.specialty}</p>
          <div className={styles.profileStats}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>
                {scholarData.stats.answers}
              </div>
              <div className={styles.statLabel}>Answers</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{scholarData.stats.votes}</div>
              <div className={styles.statLabel}>Helpful Votes</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>
                {scholarData.stats.rewards}
              </div>
              <div className={styles.statLabel}>SUI Rewards</div>
            </div>
          </div>
          <button className={styles.rewardButton}>
            <span className={styles.rewardIcon}>🎁</span> Reward Scholar
          </button>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className={styles.profileTabs}>
        <ul className={styles.tabList}>
          <li
            className={`${styles.tabItem} ${
              activeTab === "answers" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("answers")}
          >
            Answers ({scholarData.stats.answers})
          </li>
          <li
            className={`${styles.tabItem} ${
              activeTab === "credentials" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("credentials")}
          >
            Credentials
          </li>
          <li
            className={`${styles.tabItem} ${
              activeTab === "about" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("about")}
          >
            About
          </li>
        </ul>
      </div>

      {/* Answers Tab Content */}
      <div
        className={`${styles.answersContainer} ${
          activeTab !== "answers" ? styles.hidden : ""
        }`}
      >
        {answersData.map((answer) => (
          <div key={answer.id} className={styles.answerCard}>
            <a href="#" className={styles.questionLink}>
              {answer.question}
            </a>
            <div className={styles.answerContent}>{answer.answer}</div>
            <div className={styles.answerMeta}>
              <div className={styles.metaActions}>
                <div className={styles.voteCircle}>{answer.votes}</div>
                <span className={styles.actionButton}>Like</span>
                <span className={styles.actionButton}>Reward</span>
                <span className={styles.actionButton}>Follow-up Question</span>
              </div>
              <div>{answer.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Credentials Tab Content */}
      <div
        className={`${styles.credentialsContainer} ${
          activeTab !== "credentials" ? styles.hidden : ""
        }`}
      >
        {[...credentialsData, ...additionalCredentials].map(
          (credential, index) => (
            <div key={index} className={styles.credentialCard}>
              <div className={styles.credentialTitle}>{credential.title}</div>
              <div className={styles.credentialMeta}>
                <div className={styles.credentialIssuer}>
                  {credential.issuer}
                </div>
                <div>Verified on-chain</div>
              </div>
              <div className={styles.credentialContent}>
                {credential.content}
              </div>
              <div className={styles.credentialVerify}>
                <div className={styles.verifyIcon}>✓</div>
                <div className={styles.verifyText}>
                  Verified by {credential.verifications} attestation authorities
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* About Tab Content */}
      <div
        className={`${styles.aboutContainer} ${
          activeTab !== "about" ? styles.hidden : ""
        }`}
      >
        <div className={styles.aboutContent}>
          <h3>Biography</h3>
          {aboutData.biography.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          <h3>Teaching Focus</h3>
          {aboutData.focus.map((item, index) => (
            <p key={index}>• {item}</p>
          ))}

          <h3>Publications</h3>
          {aboutData.publications.map((publication, index) => (
            <p key={index}>• {publication}</p>
          ))}

          <h3>Languages</h3>
          {aboutData.languages.map((language, index) => (
            <p key={index}>• {language}</p>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Profile;
