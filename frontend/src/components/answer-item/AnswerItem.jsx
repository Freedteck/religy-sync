import { formatTime } from "../../utils/timeFormatter";
import { truncateAddress } from "../../utils/truncateAddress";
import styles from "./AnswerItem.module.css";

const AnswerItem = ({ 
  answer, 
  likeAnswer, 
  sendReward,
  onCreateFollowUp,
  currentUserIsOriginalAsker
}) => {
  return (
    <div className={styles["answer-item"]}>
      <p className={styles["answer-content"]}>
        {answer.data.content.fields.body}
      </p>
      <div className={styles["answer-meta"]}>
        <div className={styles["scholar-info"]}>
          <div className={styles["scholar-avatar"]}>
            {answer.scholarInitials}
          </div>
          <div className={styles["scholar-details"]}>
            <h3 className={styles["scholar-name"]}>
              {truncateAddress(answer.data.content.fields.creator)}
            </h3>
            <p className={styles["scholar-title"]}>{answer.scholarTitle}</p>
          </div>
        </div>

        <div className={styles["answer-stats"]}>
          <button
            className={styles["helpful-btn"]}
            onClick={() => likeAnswer(answer.data.objectId, "answer")}
          >
            <span>✓</span>
            <span>Helpful ({answer.data.content.fields.likes})</span>
          </button>
          <button
            className={styles["tip-btn"]}
            onClick={() => sendReward(answer.data.objectId, 2)}
          >
            <span className={styles["tip-icon"]}>🪙</span>
            <span>Tip Scholar</span>
          </button>
          {currentUserIsOriginalAsker && (
            <button
              className={styles["followup-btn"]}
              onClick={() => onCreateFollowUp(answer.data.objectId)}
            >
              <span>➕</span>
              <span>Add Follow-up</span>
            </button>
          )}
          <div className={styles["answer-date"]}>
            {formatTime(answer.timestampMs)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerItem;