import styles from "./Answers.module.css";

const Answers = ({ answers, sortOrder, handleSortChange }) => {
  return (
    <div className={styles["answers-section"]}>
      <div className={styles["section-header"]}>
        <div className={styles["section-title"]}>
          Answers{" "}
          <span className={styles["answer-count"]}>{answers.length}</span>
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
      {answers.map((answer) => (
        <div className={styles["answer-item"]} key={answer.id}>
          <div className={styles["answer-content"]}>{answer.content}</div>
          <div className={styles["answer-meta"]}>
            <div className={styles["scholar-info"]}>
              <div className={styles["scholar-avatar"]}>
                {answer.scholarInitials}
              </div>
              <div className={styles["scholar-details"]}>
                <h3 className={styles["scholar-name"]}>{answer.scholarName}</h3>
                <p className={styles["scholar-title"]}>{answer.scholarTitle}</p>
              </div>
            </div>

            <div className={styles["answer-stats"]}>
              <button className={styles["helpful-btn"]}>
                <span>✓</span>
                <span>Helpful ({answer.helpfulCount})</span>
              </button>
              <button className={styles["tip-btn"]}>
                <span className={styles["tip-icon"]}>🪙</span>
                <span>Tip Scholar</span>
              </button>
              <div className={styles["answer-date"]}>{answer.answeredAt}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Answers;
