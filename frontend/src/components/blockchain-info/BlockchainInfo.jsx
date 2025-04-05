import styles from "./BlockchainInfo.module.css";
const BlockchainInfo = () => {
  return (
    <section className={styles["blockchain-info"]}>
      <div className={styles["blockchain-title"]}>
        <div className={styles["blockchain-icon"]}></div>
        Blockchain Information
      </div>
      <div className={styles["blockchain-content"]}>
        <div className={styles["blockchain-item"]}>
          <div className={styles["blockchain-item-title"]}>Wallet Status</div>
          <div className={styles["blockchain-item-value"]}>
            Connected (0x7a12...5f92)
          </div>
        </div>
        <div className={styles["blockchain-item"]}>
          <div className={styles["blockchain-item-title"]}>Network</div>
          <div className={styles["blockchain-item-value"]}>Sui Mainnet</div>
        </div>
        <div className={styles["blockchain-item"]}>
          <div className={styles["blockchain-item-title"]}>NFT Status</div>
          <div className={styles["blockchain-item-value"]}>
            Question will be minted as NFT
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlockchainInfo;
