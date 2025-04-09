import { useState } from "react";
import styles from "./YourAnswer.module.css";
import Button from "../button/Button";
import toast from "react-hot-toast";
import { useCurrentAccount } from "@mysten/dapp-kit";
import useScholarStatus from "../../hooks/useScholarStatus";
import useCreateContent from "../../hooks/useCreateContent";
import { formatObjectId } from "../../utils/helpers";

const YourAnswer = ({
  religySyncPackageId,
  platformId,
  suiClient,
  signAndExecute,
  questionId,
  refetchAnswers,
}) => {
  const [answerText, setAnswerText] = useState("");
  const account = useCurrentAccount();

  const { isScholar, scholarCapId, loading } = useScholarStatus(
    suiClient,
    religySyncPackageId,
    platformId,
    account
  );

  const { createAnswer, applyForScholar } = useCreateContent(
    religySyncPackageId,
    platformId,
    suiClient,
    signAndExecute
  );

  const onSuccess = () => {
    setAnswerText("");
    refetchAnswers();
  };

  const handleSubmitAnswer = (answer) => {
    if (!answer.trim()) {
      toast.error("Please enter an answer before submitting.");
      return;
    }

    if (!isScholar || !scholarCapId) {
      toast.error("You must be a verified scholar to submit an answer.");
      return;
    }

    // Create metadata JSON object
    const metadata = {
      timestamp: new Date().toISOString(),
      platform: "ReligySync",
    };

    createAnswer(
      scholarCapId,
      questionId,
      "Answer to question",
      answer,
      metadata,
      onSuccess
    );
  };

  const handleApplyForScholar = () => {
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }

    applyForScholar(
      "Mubarak Freed", // Name
      "A Nice Credential", // Credential
      "Islam", // Tradition
      "Muslim Boy" // Description
    );
  };

  return (
    <div className={styles["your-answer"]}>
      <div className={styles["scholar-status"]}>
        {loading ? (
          <p>Checking status...</p>
        ) : isScholar ? (
          <div>
            <p className={styles["scholar-badge"]}>✓ Verified</p>
            {scholarCapId ? (
              <p className={styles["cap-id"]}>
                Cap ID: {formatObjectId(scholarCapId)}
              </p>
            ) : (
              <p className={styles["warning"]}>
                Scholar cap not found. Please contact support.
              </p>
            )}
          </div>
        ) : (
          <div className={styles["scholar-actions"]}>
            <p className={styles["not-scholar"]}>
              You are not a verified scholar
            </p>
            <button
              className={styles["apply-button"]}
              onClick={handleApplyForScholar}
            >
              Apply for scholar
            </button>
          </div>
        )}
      </div>

      <h3 className={styles["answer-form-title"]}>Your Answer</h3>
      <textarea
        className={styles["answer-textarea"]}
        placeholder={
          isScholar
            ? "Share your knowledge as a verified scholar..."
            : "Share your thoughts or ask for clarification..."
        }
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
      ></textarea>

      <Button
        onClick={() => handleSubmitAnswer(answerText)}
        text={"Submit Answer"}
        disabled={!isScholar || !scholarCapId}
      />

      {(!isScholar || !scholarCapId) && (
        <p className={styles["scholar-required"]}>
          Note: Only verified scholars can submit answers. Please apply to
          become a scholar.
        </p>
      )}

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
