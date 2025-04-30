import { useCurrentAccount } from "@mysten/dapp-kit";
import { useState } from "react";
import styles from "./AnswerItem.module.css";
import { truncateAddress } from "../../utils/truncateAddress";
import { formatTime } from "../../utils/timeFormatter";
import ThreadContainer from "../answer-thread/ThreadContainer";
import ResponseForm from "../response-form/ResponseForm";
import Jazzicon from "react-jazzicon";
import TipModal from "../../modals/tip-modal/TipModal";
import { FaCheck, FaCoins, FaReply, FaChevronDown, FaChevronUp } from "react-icons/fa";

const AnswerItem = ({
  answer,
  likeAnswer,
  sendReward,
  createFollowup,
  createClarification,
  isRewardSent,
}) => {
  const [showFollowupForm, setShowFollowupForm] = useState(false);
  const [expandedAnswer, setExpandedAnswer] = useState(false);
  const [openTipModal, setOpenTipModal] = useState(false);
  const account = useCurrentAccount();

  const toggleFollowupForm = () => {
    setShowFollowupForm((prev) => !prev);
  };

  const handleFollowupSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = "Follow up to question";
    const content = form.content.value;
    const metadata = JSON.stringify({ timestamp: new Date().toISOString() });

    createFollowup(
      answer.data.objectId,
      answer.data.content.fields.related_to,
      title,
      content,
      metadata,
      () => {
        form.reset();
        toggleFollowupForm();
      }
    );
  };

  const openTipModalHandler = () => {
    setOpenTipModal(true);
  };

  const closeTipModalHandler = () => {
    setOpenTipModal(false);
  };

  return (
    <div className={styles["answer-item"]}>
      <p className={styles["answer-content"]}>
        {answer.data.content.fields.body}
      </p>

      <div className={styles["answer-meta"]}>
        <div className={styles["scholar-info"]}>
          <Jazzicon
            diameter={40}
            seed={parseInt(answer.data.content.fields.creator.slice(2, 8), 16)}
          />
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
            <FaCheck />
            <span>Helpful ({answer.data.content.fields.likes})</span>
          </button>
          <button className={styles["tip-btn"]} onClick={openTipModalHandler}>
            <FaCoins className={styles["tip-icon"]} />
            <span>Tip Scholar</span>
          </button>
          <div className={styles["answer-date"]}>
            {formatTime(answer.timestampMs)}
          </div>
        </div>
      </div>

      <div className={styles["answer-actions"]}>
        <div className={styles["action-buttons"]}>
          {answer.data.content.fields.creator !== account?.address && (
            <button
              className={styles["reply-btn"]}
              onClick={toggleFollowupForm}
            >
              <FaReply /> Reply
            </button>
          )}

          {answer.followups && answer.followups.length > 0 && (
            <button
              className={styles["toggle-thread-btn"]}
              onClick={() => setExpandedAnswer((prev) => !prev)}
            >
              {expandedAnswer ? (
                <>
                  <FaChevronUp /> Hide replies
                </>
              ) : (
                <>
                  <FaChevronDown /> Show replies ({answer.followups.length})
                </>
              )}
            </button>
          )}
        </div>

        {showFollowupForm && (
          <ResponseForm
            onSubmit={handleFollowupSubmit}
            onCancel={toggleFollowupForm}
            placeholder="Your follow-up question..."
          />
        )}
      </div>

      {answer.followups && answer.followups.length > 0 && expandedAnswer && (
        <ThreadContainer
          followups={answer.followups}
          answerId={answer.data.objectId}
          creatorAddress={answer.data.content.fields.creator}
          createClarification={createClarification}
        />
      )}

      <TipModal
        isOpen={openTipModal}
        onClose={closeTipModalHandler}
        answerId={answer.data.objectId}
        sendReward={sendReward}
        isRewardSent={isRewardSent}
      />
    </div>
  );
};

export default AnswerItem;