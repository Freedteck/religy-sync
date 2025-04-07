import { Link } from "react-router-dom";
import styles from "./QuestionList.module.css";
import PropTypes from "prop-types";
import { formatTime } from "../../utils/timeFormatter";
import { truncateAddress } from "../../utils/truncateAddress";

const QuestionList = ({ questionList }) => {
  return (
    <ul className={styles["question-list"]}>
      {questionList?.map((question) => (
        <li className={styles["question-item"]} key={question.data.objectId}>
          <Link
            to={`/questions/${question.data.objectId}`}
            className={styles["question-link"]}
          >
            <div className={styles["question-header"]}>
              <h2 className={styles.title}>
                {question.data.content.fields.title}
              </h2>
              <div
                className={`${styles["question-status"]} ${
                  question.data.content.fields.status === "Answered"
                    ? styles["status-answered"]
                    : styles["status-pending"]
                }`}
              >
                {question.data.content.fields.status}
              </div>
            </div>
            <p className={styles["question-content"]}>
              {question.data.content.fields.body}
            </p>
            <div className={styles["question-tags"]}>
              {JSON.parse(question.data.content.fields.metadata).tags.map(
                (tag, idx) => (
                  <div className={styles.tag} key={idx}>
                    {tag}
                  </div>
                )
              )}
            </div>
            <div className={styles.meta}>
              <div className={styles.left}>
                <div className={styles.item}>
                  <span className={styles.icon}>↑</span>
                  <span>{question.data.content.fields.likes} votes</span>
                </div>
                <div className={styles.item}>
                  <span className={styles.icon}>💬</span>
                  <span>{question.data.content.fields.answers} answers</span>
                </div>
              </div>
              <div className={styles.user}>
                <div className={styles.avatar}>
                  {question.data.content.fields.creator.charAt(0)}
                </div>
                <span>
                  Asked by{" "}
                  {truncateAddress(question.data.content.fields.creator)} •{" "}
                  {formatTime(question.timestampMs)}
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
