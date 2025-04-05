import BlockchainInfo from "../../components/blockchain-info/BlockchainInfo";
import QuestionForm from "../../components/question-form/QuestionForm";
import styles from "./AskQuestion.module.css";
const AskQuestion = () => {
  return (
    <main className={styles["ask-question"]}>
      <section className={styles["top-header"]}>
        <h1 className={styles.title}>Ask a Question</h1>
        <p className={styles.subtitle}>
          Submit your faith-related question to be answered by our verified
          scholars. Your question will be stored on the Sui blockchain for
          authenticity and permanence.
        </p>
      </section>
      <QuestionForm />
      <BlockchainInfo />
    </main>
  );
};

export default AskQuestion;
