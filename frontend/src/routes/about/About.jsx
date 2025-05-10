import {
  FaQuestionCircle,
  FaUserShield,
  FaLink,
  FaCoins,
  FaHandsHelping,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaDiscord,
  FaShieldAlt,
  FaFingerprint,
} from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { MdInterests, MdSecurity } from "react-icons/md";
import BenefitCard from "../../components/benefit-card/BenefitCard";
import ContactForm from "../../components/contact-form/ContactForm";
import ContactInfo from "../../components/contact-info/ContactInfo";
import FAQItem from "../../components/faq-item/FAQItem";
import FeatureItem from "../../components/feature-item/FeatureItem";
import TeamMember from "../../components/team-member/TeamMember";
import styles from "./About.module.css";

const About = () => {
  const features = [
    {
      icon: <FaQuestionCircle className={styles.featureIcon} />,
      title: "Ask Religious Questions",
      description:
        "Post your spiritual and religious questions and receive thoughtful answers from verified religious scholars.",
    },
    {
      icon: <RiVerifiedBadgeFill className={styles.featureIcon} />,
      title: "Verified Scholars",
      description:
        "All religious experts are thoroughly verified to ensure authentic and accurate information.",
    },
    {
      icon: <MdSecurity className={styles.featureIcon} />,
      title: "Flexible Authentication",
      description:
        "Choose between traditional wallet connection or privacy-preserving zkLogin to access the platform.",
    },
    {
      icon: <FaCoins className={styles.featureIcon} />,
      title: "Reward System",
      description:
        "Show appreciation by rewarding valuable contributions with SUI tokens.",
    },
    {
      icon: <FaHandsHelping className={styles.featureIcon} />,
      title: "Interfaith Dialogue",
      description:
        "Explore multiple faith traditions in a respectful and inclusive environment.",
    },
  ];

  const faqs = [
    {
      question: "What is ReligySync?",
      answer:
        "ReligySync is a Web3 platform that connects spiritual seekers with verified religious scholars. It allows users to ask religious questions, access faith-based knowledge, and engage with authentic spiritual content. All contributions are stored on the Sui blockchain for transparency and permanence.",
    },
    {
      question: "How do I create an account?",
      answer:
        "You can create an account either by connecting a crypto wallet (like Sui Wallet, Slush, or other Sui compatible wallets) or by using our zkLogin feature which allows you to sign in with Google, Facebook, or email without exposing personal information on the blockchain.",
    },
    {
      question: "What are the benefits of zkLogin?",
      answer:
        "zkLogin provides a familiar login experience while maintaining your privacy. It uses zero-knowledge proofs to verify your identity without storing personal data on-chain. This is ideal for users who want Web3 benefits without managing crypto wallets.",
    },
    {
      question: "How are scholars verified?",
      answer:
        "Scholars undergo a rigorous verification process that includes credential checks, community vouching, and review of their religious educational background. We verify scholars' expertise in their claimed faith traditions to ensure authentic and accurate information is shared on our platform.",
    },
    {
      question: "What blockchain technology does ReligySync use?",
      answer:
        "ReligySync is built on the Sui blockchain, which provides speed, scalability, and low transaction costs. This allows us to store all questions, answers, and educational content as NFTs on-chain, ensuring authenticity and permanence of knowledge.",
    },
    {
      question: "How does the reward system work?",
      answer:
        "Users can reward helpful scholars and content creators by sending them SUI tokens directly through the platform. Both wallet users and zkLogin users can participate in the reward system, with zkLogin users receiving a managed wallet automatically.",
    },
    {
      question: "Which faith traditions are supported?",
      answer:
        "ReligySync currently supports major world religions including Buddhism, Christianity, Hinduism, Islam, Judaism, and Sikhism, as well as other spiritual traditions. We're continuously expanding our network of verified scholars to include more diverse religious perspectives.",
    },
  ];

  const teamMembers = [
    {
      initials: "AR",
      name: "Ava Rodriguez",
      role: "Founder & CEO",
      bio: "Interfaith scholar with expertise in comparative religion and 8 years of experience in blockchain technology.",
    },
    {
      initials: "JL",
      name: "James Lee",
      role: "CTO",
      bio: "Blockchain architect with previous experience at major Web3 projects and a background in religious studies.",
    },
    {
      initials: "SM",
      name: "Sarah Miller",
      role: "Head of Scholar Relations",
      bio: "PhD in Religious Studies with extensive connections across multiple faith communities worldwide.",
    },
    {
      initials: "RK",
      name: "Raj Kumar",
      role: "Lead Developer",
      bio: "Full-stack developer with specialization in Web3 technologies and smart contract development.",
    },
  ];

  const benefits = [
    {
      icon: <RiVerifiedBadgeFill className={styles.benefitIcon} />,
      title: "Authenticity",
      text: "Blockchain verification ensures that all content is authentic and cannot be altered after posting, preserving the integrity of religious teachings.",
    },
    {
      icon: <FaFingerprint className={styles.benefitIcon} />,
      title: "Privacy Options",
      text: "Choose between full Web3 wallet authentication or privacy-preserving zkLogin based on your comfort level with blockchain technology.",
    },
    {
      icon: <FaLink className={styles.benefitIcon} />,
      title: "Transparency",
      text: "The verification status of scholars and the provenance of all content is transparent and verifiable by anyone on the blockchain.",
    },
    {
      icon: <FaCoins className={styles.benefitIcon} />,
      title: "Reward System",
      text: "Direct token transfers enable seamless rewards for valuable contributions, with options for both crypto-native and mainstream users.",
    },
    {
      icon: <MdInterests className={styles.benefitIcon} />,
      title: "Decentralization",
      text: "No central authority controls the content, allowing for uncensored, diverse religious perspectives to flourish.",
    },
    {
      icon: <FaUserShield className={styles.benefitIcon} />,
      title: "Ownership",
      text: "Contributors maintain ownership of their content through NFTs, giving proper attribution to scholars and content creators.",
    },
  ];

  const contactItems = [
    {
      icon: <FaEnvelope className={styles.contactIcon} />,
      text: "hello@religysync.io",
    },
    {
      icon: <FaLink className={styles.contactIcon} />,
      text: "@ReligySync on all social platforms",
    },
    {
      icon: <FaDiscord className={styles.contactIcon} />,
      text: "Join our Discord community",
    },
    {
      icon: <FaMapMarkerAlt className={styles.contactIcon} />,
      text: "San Francisco, CA & Remote Worldwide",
    },
  ];

  return (
    <main className={styles.about}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>About ReligySync</h1>
          <p className={styles.subtitle}>
            Discover authentic spiritual wisdom secured by blockchain technology
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className={`${styles.section} ${styles.missionSection}`}>
        <div className={styles.container}>
          <div className={styles.missionContent}>
            <h2 className={styles.sectionTitle}>Our Mission</h2>
            <div className={styles.missionText}>
              <p>
                ReligySync is a Web3-powered faith-based platform built on the
                Sui blockchain that bridges the gap between spiritual seekers
                and verified religious scholars.
              </p>
              <p>
                Our mission is to democratize access to authentic religious
                knowledge while maintaining the highest standards of accuracy
                and respect. By leveraging blockchain technology, we ensure that
                valuable spiritual insights are permanently recorded and immune
                to censorship or manipulation.
              </p>
              <p>
                Whether you're exploring your own faith tradition more deeply or
                seeking to understand other religious perspectives, ReligySync
                provides a trusted space for respectful dialogue and learning
                across different belief systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`${styles.section} ${styles.featuresSection}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Key Features</h2>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <FeatureItem
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className={`${styles.section} ${styles.faqSection}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqContainer}>
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isActive={index === 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Blockchain Benefits Section */}
      <section className={`${styles.section} ${styles.blockchainSection}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Why Blockchain Technology?</h2>
          <p className={styles.blockchainDescription}>
            By leveraging the Sui blockchain, ReligySync brings unprecedented
            benefits to religious knowledge sharing and preservation.
          </p>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <BenefitCard
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                text={benefit.text}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={`${styles.section} ${styles.teamSection}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Meet Our Team</h2>
          <div className={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
                initials={member.initials}
                name={member.name}
                role={member.role}
                bio={member.bio}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={`${styles.section} ${styles.contactSection}`}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            <ContactInfo contactItems={contactItems} />
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
