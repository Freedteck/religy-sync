import { Link } from "react-router-dom";
import styles from "./QuestionList.module.css";
import PropTypes from "prop-types";

const QuestionList = ({ questionList }) => {
  return (
    <ul className={styles["question-list"]}>
      {questionList.map((q, index) => (
        <li className={styles["question-item"]} key={index}>
          <Link to={`/questions/${index}`} className={styles["question-link"]}>
            <div className={styles["question-header"]}>
              <h2 className={styles.title}>{q.title}</h2>
              <div
                className={`${styles["question-status"]} ${
                  q.status === "Answered"
                    ? styles["status-answered"]
                    : styles["status-pending"]
                }`}
              >
                {q.status}
              </div>
            </div>
            <p className={styles["question-content"]}>{q.content}</p>
            <div className={styles["question-tags"]}>
              {q.tags.map((tag, idx) => (
                <div className={styles.tag} key={idx}>
                  {tag}
                </div>
              ))}
            </div>
            <div className={styles.meta}>
              <div className={styles.left}>
                <div className={styles.item}>
                  <span className={styles.icon}>↑</span>
                  <span>{q.votes} votes</span>
                </div>
                <div className={styles.item}>
                  <span className={styles.icon}>💬</span>
                  <span>{q.answers} answers</span>
                </div>
                <div className={styles.item}>
                  <span className={styles.icon}>👁️</span>
                  <span>{q.views} views</span>
                </div>
              </div>
              <div className={styles.user}>
                <div className={styles.avatar}>{q.user.charAt(0)}</div>
                <span>
                  Asked by {q.user} • {q.time}
                </span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

QuestionList.propTypes = {
  questionList: PropTypes.array.isRequired,
};

export default QuestionList;
