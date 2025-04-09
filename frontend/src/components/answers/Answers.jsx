import { formatTime } from "../../utils/timeFormatter";
import { truncateAddress } from "../../utils/truncateAddress";
import styles from "./Answers.module.css";

const Answers = ({
  answers,
  sortOrder,
  handleSortChange,
  likeAnswer,
  sendReward,
}) => {
  return (
    <div className={styles["answers-section"]}>
      <div className={styles["section-header"]}>
        <div className={styles["section-title"]}>
          Answers
          <span className={styles["answer-count"]}>{answers?.length}</span>
        </div>
        <select
          className={styles["sort-dropdown"]}
          value={sortOrder}
          onChange={handleSortChange}
        >
          <option value="votes">Sort by votes</option>
          <option value="newest">Sort by newest</option>
          <option value="oldest">Sort by oldest</option>
        </select>
      </div>
      {answers?.map((answer) => (
        <div className={styles["answer-item"]} key={answer.data.objectId}>
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
              <div className={styles["answer-date"]}>
                {formatTime(answer.timestampMs)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Answers;
