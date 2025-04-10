import AnswerItem from "../answer-item/AnswerItem";
import styles from "./Answers.module.css";

const Answers = ({
  answers,
  sortOrder,
  handleSortChange,
  likeAnswer,
  sendReward,
  isRewardSent,
  createFollowup,
  createClarification,
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
        <AnswerItem
          key={answer.data.objectId}
          answer={answer}
          likeAnswer={likeAnswer}
          sendReward={sendReward}
          createFollowup={createFollowup}
          createClarification={createClarification}
          isRewardSent={isRewardSent}
        />
      ))}
    </div>
  );
};

export default Answers;
