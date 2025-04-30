import BlockchainInfo from "../../components/blockchain-info/BlockchainInfo";
import InsightForm from "../../components/insight-form/InsightForm";
import styles from "./CreateInsight.module.css";

const CreateInsight = () => {
  return (
    <main className={styles["create-insight"]}>
      <section className={styles["top-header"]}>
        <h1 className={styles.title}>Create Insight</h1>
        <p className={styles.subtitle}>
          Share your wisdom and knowledge with the community. Your insight will
          be stored on the Sui blockchain for authenticity and permanence.
        </p>
      </section>
      <InsightForm />
      <BlockchainInfo contentType={"Insight"} />
    </main>
  );
};

export default CreateInsight;
