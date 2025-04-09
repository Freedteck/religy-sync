import { formatTime } from "../../utils/timeFormatter";
import { truncateAddress } from "../../utils/truncateAddress";
import styles from "./ClarificationItem.module.css";

const ClarificationItem = ({ clarification, likeContent }) => {
  return (
    <div className={styles["clarification-item"]}>
      <div className={styles["clarification-header"]}>
        <span className={styles["clarification-badge"]}>Clarification</span>
      </div>
      <p className={styles["clarification-content"]}>
        {clarification.data.content.fields.body}
      </p>
      <div className={styles["clarification-meta"]}>
        <div className={styles["scholar-info"]}>
          <div className={styles["scholar-avatar"]}>
            {clarification.scholarInitials}
          </div>
          <div className={styles["scholar-details"]}>
            <h4 className={styles["scholar-name"]}>
              {truncateAddress(clarification.data.content.fields.creator)}
            </h4>
            <p className={styles["scholar-title"]}>
              {clarification.scholarTitle}
            </p>
          </div>
        </div>

        <div className={styles["clarification-stats"]}>
          <button
            className={styles["helpful-btn"]}
            onClick={() =>
              likeContent(clarification.data.objectId, "clarification")
            }
          >
            <span>✓</span>
            <span>Helpful ({clarification.data.content.fields.likes})</span>
          </button>
          <div className={styles["clarification-date"]}>
            {formatTime(clarification.timestampMs)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClarificationItem;
