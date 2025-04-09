import { formatTime } from "../../utils/timeFormatter";
import { truncateAddress } from "../../utils/truncateAddress";
import styles from "./FollowupItem.module.css";

const FollowUpItem = ({
  followUp,
  likeContent,
  scholarCanCreateClarification,
  onCreateClarification,
}) => {
  return (
    <div className={styles["followup-item"]}>
      <div className={styles["followup-header"]}>
        <span className={styles["followup-badge"]}>Follow-up</span>
      </div>
      <p className={styles["followup-content"]}>
        {followUp.data.content.fields.body}
      </p>
      <div className={styles["followup-meta"]}>
        <div className={styles["user-info"]}>
          <div className={styles["user-avatar"]}>
            {followUp.userInitials || "U"}
          </div>
          <div className={styles["user-details"]}>
            <h4 className={styles["user-name"]}>
              {truncateAddress(followUp.data.content.fields.creator)}
            </h4>
            <p className={styles["user-type"]}>Original Asker</p>
          </div>
        </div>

        <div className={styles["followup-stats"]}>
          <button
            className={styles["helpful-btn"]}
            onClick={() => likeContent(followUp.data.objectId, "followup")}
          >
            <span>✓</span>
            <span>Helpful ({followUp.data.content.fields.likes})</span>
          </button>
          {scholarCanCreateClarification && (
            <button
              className={styles["clarify-btn"]}
              onClick={() => onCreateClarification(followUp.data.objectId)}
            >
              <span>💬</span>
              <span>Add Clarification</span>
            </button>
          )}
          <div className={styles["followup-date"]}>
            {formatTime(followUp.timestampMs)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUpItem;
