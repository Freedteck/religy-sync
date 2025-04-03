import { useState } from "react";
import styles from "./YourAnswer.module.css";
import Button from "../button/Button";

const YourAnswer = ({ handleSubmitAnswer }) => {
  const [answerText, setAnswerText] = useState("");

  return (
    <div className={styles["your-answer"]}>
      <h3 className={styles["answer-form-title"]}>Your Answer</h3>
      <textarea
        className={styles["answer-textarea"]}
        placeholder="Share your knowledge or ask for clarification..."
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
      ></textarea>
      <Button
        onClick={() => {
          handleSubmitAnswer(answerText);
          setAnswerText("");
        }}
        text={"Submit Answer"}
      />
      <div className={styles["blockchain-note"]}>
        <span className={styles["blockchain-icon"]}>🔄</span>
        <span>
          Your answer will be stored on the Sui blockchain as an NFT for
          permanent availability and authenticity verification.
        </span>
      </div>
    </div>
  );
};

export default YourAnswer;
