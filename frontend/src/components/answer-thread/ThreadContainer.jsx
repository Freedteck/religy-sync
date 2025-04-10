import { useCurrentAccount } from "@mysten/dapp-kit";
import { formatTime } from "../../utils/timeFormatter";
import { truncateAddress } from "../../utils/truncateAddress";
import { useState } from "react";
import styles from "./ThreadContainer.module.css";
import ResponseForm from "../response-form/ResponseForm";

const ThreadContainer = ({
  followups,
  answerId,
  creatorAddress,
  createClarification,
}) => {
  const [clarificationStates, setClarificationStates] = useState({});
  const account = useCurrentAccount();

  const toggleClarificationForm = (followupId) => {
    setClarificationStates((prev) => ({
      ...prev,
      [followupId]: !prev[followupId],
    }));
  };

  const handleClarificationSubmit = (followupId, e) => {
    e.preventDefault();
    const form = e.target;
    const title = "Clarification to followup";
    const content = form.content.value;
    const metadata = JSON.stringify({ timestamp: new Date().toISOString() });

    createClarification(followupId, answerId, title, content, metadata, () => {
      form.reset();
      toggleClarificationForm(followupId);
    });
  };

  return (
    <div className={styles["thread-container"]}>
      {[...followups].reverse().map((followup) => (
        <div
          key={followup.data.data.objectId}
          className={styles["thread-item"]}
        >
          <div className={styles["thread-content"]}>
            <p>{followup.data.data.content.fields.body}</p>
            <div className={styles["thread-meta"]}>
              <div className={styles["thread-author"]}>
                {truncateAddress(followup.data.data.content.fields.creator)}
              </div>
              <div className={styles["thread-date"]}>
                {formatTime(followup.timestampMs)}
              </div>
            </div>

            {/* Only show clarification button for original answerer */}
            {creatorAddress === account?.address && (
              <button
                className={styles["reply-thread-btn"]}
                onClick={() =>
                  toggleClarificationForm(followup.data.data.objectId)
                }
              >
                Reply
              </button>
            )}
          </div>

          {clarificationStates[followup.data.data.objectId] && (
            <ResponseForm
              onSubmit={(e) =>
                handleClarificationSubmit(followup.data.data.objectId, e)
              }
              onCancel={() =>
                toggleClarificationForm(followup.data.data.objectId)
              }
              placeholder="Your clarification..."
            />
          )}

          {/* Display nested clarifications */}
          {followup.clarifications && followup.clarifications.length > 0 && (
            <div className={styles["nested-replies"]}>
              {followup.clarifications.map((clarification) => (
                <div
                  key={clarification.data.data.objectId}
                  className={styles["nested-reply-item"]}
                >
                  <p>{clarification.data.data.content.fields.body}</p>
                  <div className={styles["thread-meta"]}>
                    <div className={styles["thread-author"]}>
                      {truncateAddress(
                        clarification.data.data.content.fields.creator
                      )}
                    </div>
                    <div className={styles["thread-date"]}>
                      {formatTime(clarification.timestampMs)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ThreadContainer;
