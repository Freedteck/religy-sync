import { truncateAddress } from "../../utils/truncateAddress";
import styles from "./BlockchainInfo.module.css";
import { useCurrentAccount, useSuiClientContext } from "@mysten/dapp-kit";
const BlockchainInfo = ({ contentType }) => {
  const { network } = useSuiClientContext();
  const account = useCurrentAccount();

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
            {account
              ? `Connected (${truncateAddress(account?.address)})`
              : "Not Connected"}
          </div>
        </div>
        <div className={styles["blockchain-item"]}>
          <div className={styles["blockchain-item-title"]}>Network</div>
          <div className={styles["blockchain-item-value"]}>
            Sui {network?.slice(0, 1).toUpperCase() + network?.slice(1)}
          </div>
        </div>
        <div className={styles["blockchain-item"]}>
          <div className={styles["blockchain-item-title"]}>NFT Status</div>
          <div className={styles["blockchain-item-value"]}>
            {contentType} will be minted as NFT
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlockchainInfo;
