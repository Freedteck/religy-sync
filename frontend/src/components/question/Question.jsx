import { truncateAddress } from "../../utils/truncateAddress";
import styles from "./Question.module.css";

const Question = ({ question, likeQuestion }) => {
  return (
    <section className={styles["question-container"]}>
      <div className={styles["question-header"]}>
        <h1 className={styles["question-title"]}>{question.title}</h1>
        <div
          className={`${styles["question-status"]} ${
            styles[question.statusClass]
          }`}
        >
          {question.status}
        </div>
      </div>
      <p className={styles["question-details"]}>{question.body}</p>
      <div className={styles["question-tags"]}>
        {JSON.parse(question.metadata).tags.map((tag, index) => (
          <div className={styles.tag} key={index}>
            {tag}
          </div>
        ))}
      </div>
      <div className={styles["question-meta"]}>
        <div className={styles["vote-buttons"]}>
          <button className={styles["vote-btn"]} onClick={likeQuestion}>
            ↑
          </button>
          <span className={styles["vote-count"]}>{question.likes}</span>
          <button className={styles["vote-btn"]}>↓</button>
        </div>

        <div className={styles["meta-left"]}>
          <div className={styles["meta-item"]}>
            <span className={styles["meta-icons"]}>💬</span>
            <span>{question.answers} answers</span>
          </div>
          {/* <div className={styles["meta-item"]}>
            <span className={styles["meta-icons"]}>👁️</span>
            <span>{question.views} views</span>
          </div> */}
        </div>

        <div className={styles["user-info"]}>
          <div className={styles["user-avatar"]}>
            {question.askedByInitials}
          </div>
          <div>
            <h3>Asked by {truncateAddress(question.creator)}</h3>
            <p>{question.askedAt}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Question;
