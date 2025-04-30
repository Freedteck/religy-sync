import BlockchainInfo from "../../components/blockchain-info/BlockchainInfo";
import PrayerForm from "../../components/prayer-form/PrayerForm";
import styles from "./CreatePrayer.module.css";
const CreatePrayer = () => {
  return (
    <main className={styles["create-prayer"]}>
      <section className={styles["top-header"]}>
        <h1 className={styles.title}>Share Your Prayer</h1>
        <p className={styles.subtitle}>
          Lift up your prayers to be shared with our faith community. Your
          prayer will be stored on the Sui blockchain, creating a permanent
          spiritual record and inviting others to join in intercession.
        </p>
      </section>
      <PrayerForm />
      <BlockchainInfo contentType={"Prayer"} />
    </main>
  );
};

export default CreatePrayer;
