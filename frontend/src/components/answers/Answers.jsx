import { formatTime } from "../../utils/timeFormatter";
import { truncateAddress } from "../../utils/truncateAddress";
import { useState } from "react";
import styles from "./Answers.module.css";
import { useCurrentAccount } from "@mysten/dapp-kit";

const Answers = ({
  answers,
  sortOrder,
  handleSortChange,
  likeAnswer,
  sendReward,
  createFollowup,
  createClarification,
  // scholarCapId,
}) => {
  const [followupStates, setFollowupStates] = useState({});
  const [clarificationStates, setClarificationStates] = useState({});
  const account = useCurrentAccount();

  const toggleFollowupForm = (answerId) => {
    setFollowupStates((prev) => ({
      ...prev,
      [answerId]: !prev[answerId],
    }));
  };

  const toggleClarificationForm = (followupId) => {
    setClarificationStates((prev) => ({
      ...prev,
      [followupId]: !prev[followupId],
    }));
  };

  const handleFollowupSubmit = (answerId, questionId, e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const content = form.content.value;
    const metadata = JSON.stringify({ timestamp: new Date().toISOString() });

    createFollowup(answerId, questionId, title, content, metadata, () => {
      // Clear form and hide it after submission
      form.reset();
      toggleFollowupForm(answerId);
    });
  };

  const handleClarificationSubmit = (followupId, answerId, e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const content = form.content.value;
    const metadata = JSON.stringify({ timestamp: new Date().toISOString() });

    createClarification(
      // scholarCapId,
      followupId,
      answerId,
      title,
      content,
      metadata,
      () => {
        // Clear form and hide it after submission
        form.reset();
        toggleClarificationForm(followupId);
      }
    );
  };

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
        <div className={styles["answer-item"]} key={answer.data.objectId}>
          <p className={styles["answer-content"]}>
            {answer.data.content.fields.body}
          </p>
          <div className={styles["answer-meta"]}>
            <div className={styles["scholar-info"]}>
              <div className={styles["scholar-avatar"]}>
                {answer.scholarInitials}
              </div>
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
                <span>✓</span>
                <span>Helpful ({answer.data.content.fields.likes})</span>
              </button>
              <button
                className={styles["tip-btn"]}
                onClick={() => sendReward(answer.data.objectId, 2)}
              >
                <span className={styles["tip-icon"]}>🪙</span>
                <span>Tip Scholar</span>
              </button>
              <div className={styles["answer-date"]}>
                {formatTime(answer.timestampMs)}
              </div>
            </div>
          </div>

          {/* Display follow-ups if any */}
          {answer.followups && answer.followups.length > 0 && (
            <div className={styles["followups-container"]}>
              {answer.followups
                .map((followup) => (
                  <div
                    key={followup.data.data.objectId}
                    className={styles["followup-item"]}
                  >
                    <div className={styles["followup-content"]}>
                      {/* <h4 className={styles["followup-title"]}>
                      {followup.data.data.content.fields.title}
                    </h4> */}
                      <p>{followup.data.data.content.fields.body}</p>
                      <div className={styles["followup-meta"]}>
                        <div className={styles["followup-author"]}>
                          {truncateAddress(
                            followup.data.data.content.fields.creator
                          )}
                        </div>
                        <div className={styles["followup-date"]}>
                          {formatTime(followup.timestampMs)}
                        </div>
                      </div>
                    </div>

                    {/* Display clarifications for this follow-up if any */}
                    {followup.clarifications &&
                      followup.clarifications.length > 0 && (
                        <div className={styles["clarifications-container"]}>
                          {followup.clarifications.map((clarification) => (
                            <div
                              key={clarification.data.data.objectId}
                              className={styles["clarification-item"]}
                            >
                              <h5 className={styles["clarification-title"]}>
                                {clarification.data.data.content.fields.title}
                              </h5>
                              <p>
                                {clarification.data.data.content.fields.body}
                              </p>
                              <div className={styles["clarification-meta"]}>
                                <div className={styles["clarification-author"]}>
                                  {truncateAddress(
                                    clarification.data.data.content.fields
                                      .creator
                                  )}
                                </div>
                                <div className={styles["clarification-date"]}>
                                  {formatTime(clarification.timestampMs)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    {/* Button to add clarification (only for original answerer) */}
                    {answer.data.content.fields.creator ===
                      account?.address && (
                      <div className={styles["clarification-actions"]}>
                        <button
                          className={styles["add-clarification-btn"]}
                          onClick={() =>
                            toggleClarificationForm(followup.data.data.objectId)
                          }
                        >
                          Add Clarification
                        </button>

                        {clarificationStates[followup.data.data.objectId] && (
                          <form
                            className={styles["clarification-form"]}
                            onSubmit={(e) =>
                              handleClarificationSubmit(
                                followup.data.data.objectId,
                                answer.data.objectId,
                                e
                              )
                            }
                          >
                            <input
                              type="text"
                              name="title"
                              placeholder="Title"
                              required
                              className={styles["form-input"]}
                            />
                            <textarea
                              name="content"
                              placeholder="Your clarification..."
                              required
                              className={styles["form-textarea"]}
                            ></textarea>
                            <div className={styles["form-actions"]}>
                              <button
                                type="submit"
                                className={styles["submit-btn"]}
                              >
                                Submit
                              </button>
                              <button
                                type="button"
                                className={styles["cancel-btn"]}
                                onClick={() =>
                                  toggleClarificationForm(
                                    followup.data.objectId
                                  )
                                }
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                ))
                .reverse()}
            </div>
          )}

          {/* Button to add follow-up (if user is original question asker) */}
          <div className={styles["answer-actions"]}>
            <button
              className={styles["follow-up-btn"]}
              onClick={() => toggleFollowupForm(answer.data.objectId)}
            >
              Add Follow-up Question
            </button>

            {followupStates[answer.data.objectId] && (
              <form
                className={styles["followup-form"]}
                onSubmit={(e) =>
                  handleFollowupSubmit(
                    answer.data.objectId,
                    answer.data.content.fields.related_to,
                    e
                  )
                }
              >
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  required
                  className={styles["form-input"]}
                />
                <textarea
                  name="content"
                  placeholder="Your follow-up question..."
                  required
                  className={styles["form-textarea"]}
                ></textarea>
                <div className={styles["form-actions"]}>
                  <button type="submit" className={styles["submit-btn"]}>
                    Submit
                  </button>
                  <button
                    type="button"
                    className={styles["cancel-btn"]}
                    onClick={() => toggleFollowupForm(answer.data.objectId)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Answers;
