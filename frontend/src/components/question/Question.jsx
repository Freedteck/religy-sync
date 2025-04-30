import { truncateAddress } from "../../utils/truncateAddress";
import styles from "./Question.module.css";
import Jazzicon from "react-jazzicon";
import { FaComment, FaHeart, FaRegHeart } from "react-icons/fa";

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
        <button className={styles["like-button"]} onClick={likeQuestion}>
          {question.isLiked ? (
            <FaHeart className={styles["liked-icon"]} />
          ) : (
            <FaRegHeart className={styles["like-icon"]} />
          )}
          <span>{question.likes}</span>
        </button>

        <div className={styles["meta-left"]}>
          <div className={styles["meta-item"]}>
            <FaComment className={styles["meta-icons"]} />
            <span>{question.answers} answers</span>
          </div>
        </div>

        <div className={styles["user-info"]}>
          <Jazzicon
            diameter={30}
            seed={parseInt(question.creator.slice(2, 8), 16)}
          />
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
