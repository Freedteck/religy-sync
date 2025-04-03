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
      icon: "Q",
      title: "Ask Religious Questions",
      description:
        "Post your spiritual and religious questions and receive thoughtful answers from verified religious scholars.",
    },
    {
      icon: "V",
      title: "Verified Scholars",
      description:
        "All religious experts are thoroughly verified to ensure authentic and accurate information.",
    },
    {
      icon: "B",
      title: "Blockchain Authentication",
      description:
        "All content is stored on the Sui blockchain as NFTs for authenticity and permanence.",
    },
    {
      icon: "R",
      title: "Reward System",
      description:
        "Show appreciation by rewarding valuable contributions with SUI tokens.",
    },
    {
      icon: "I",
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
      question: "How do I ask a question?",
      answer:
        'To ask a question, click on the "Ask a Question" button on the homepage or Questions page. You\'ll be prompted to select relevant tags for your question, write your question in detail, and submit it. Once submitted, your question will be available for verified scholars to answer.',
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
        "Users can reward helpful scholars and content creators by sending them SUI tokens directly through the platform. This incentivizes high-quality contributions and allows the community to show appreciation for valuable insights and teachings.",
    },
    {
      question: "Which faith traditions are supported?",
      answer:
        "ReligySync currently supports major world religions including Buddhism, Christianity, Hinduism, Islam, Judaism, and Sikhism, as well as other spiritual traditions. We're continuously expanding our network of verified scholars to include more diverse religious perspectives.",
    },
    {
      question: "Do I need a crypto wallet to use ReligySync?",
      answer:
        "While you can browse questions and answers without a wallet, connecting a wallet allows you to ask questions, reward scholars, and have your contributions stored on-chain. We support most major Sui-compatible wallets for a seamless Web3 experience.",
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
      icon: "A",
      title: "Authenticity",
      text: "Blockchain verification ensures that all content is authentic and cannot be altered after posting, preserving the integrity of religious teachings.",
    },
    {
      icon: "P",
      title: "Permanence",
      text: "Religious insights and teachings are stored permanently on-chain, creating an enduring repository of spiritual knowledge for future generations.",
    },
    {
      icon: "T",
      title: "Transparency",
      text: "The verification status of scholars and the provenance of all content is transparent and verifiable by anyone on the blockchain.",
    },
    {
      icon: "R",
      title: "Reward System",
      text: "Direct token transfers enable seamless rewards for valuable contributions, encouraging high-quality religious scholarship.",
    },
    {
      icon: "D",
      title: "Decentralization",
      text: "No central authority controls the content, allowing for uncensored, diverse religious perspectives to flourish.",
    },
    {
      icon: "O",
      title: "Ownership",
      text: "Contributors maintain ownership of their content through NFTs, giving proper attribution to scholars and content creators.",
    },
  ];
  const contactItems = [
    {
      icon: "📧",
      text: "hello@religysync.io",
    },
    {
      icon: "🔗",
      text: "@ReligySync on all social platforms",
    },
    {
      icon: "📱",
      text: "Join our Discord community",
    },
    {
      icon: "📍",
      text: "San Francisco, CA & Remote Worldwide",
    },
  ];
  return (
    <main className={styles.about}>
      <section className={styles["top-header"]}>
        <h1 className={styles.title}>About ReligySync</h1>
        <p className={styles["sub-title"]}>
          Discover authentic spiritual wisdom secured by blockchain technology
        </p>
      </section>
      <section className={styles["about-section"]}>
        <div className={styles["about-content"]}>
          <h2 className={styles["section-title"]}>Our Mission</h2>
          <p>
            ReligySync is a Web3-powered faith-based platform built on the Sui
            blockchain that bridges the gap between spiritual seekers and
            verified religious scholars. We provide a decentralized space where
            authentic religious knowledge can be shared, discussed, and
            preserved for generations to come.
          </p>
          <p>
            Our mission is to democratize access to authentic religious
            knowledge while maintaining the highest standards of accuracy and
            respect. By leveraging blockchain technology, we ensure that
            valuable spiritual insights are permanently recorded and immune to
            censorship or manipulation.
          </p>
          <p>
            Whether you're exploring your own faith tradition more deeply or
            seeking to understand other religious perspectives, ReligySync
            provides a trusted space for respectful dialogue and learning across
            different belief systems.
          </p>
        </div>

        <div className={styles["platform-features"]}>
          <h2 className={styles["section-title"]}>Key Features</h2>
          <ul className={styles["feature-list"]}>
            {features.map((feature, index) => (
              <FeatureItem
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </ul>
        </div>
      </section>
      <section className={styles["faq-section"]}>
        <h2 className={styles["section-title"]}>Frequently Asked Questions</h2>
        <div className={styles["faq-container"]}>
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isActive={index === 0}
            />
          ))}
        </div>
      </section>
      <section className={styles["blockchain-section"]}>
        <h2 className={styles["blockchain-title"]}>
          Why Blockchain Technology?
        </h2>
        <p className={styles["blockchain-description"]}>
          By leveraging the Sui blockchain, ReligySync brings unprecedented
          benefits to religious knowledge sharing and preservation. Here's how
          blockchain technology enhances our mission:
        </p>
        <div className={styles["benefit-cards"]}>
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              text={benefit.text}
            />
          ))}
        </div>
      </section>
      <section className={styles["team-section"]}>
        <h2 className={styles["section-title"]}>Meet Our Team</h2>
        <div className={styles["team-container"]}>
          <div className={styles["team-grid"]}>
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
      <section className={styles["contact-section"]}>
        <ContactInfo contactItems={contactItems} />
        <ContactForm />
      </section>
    </main>
  );
};

export default About;
