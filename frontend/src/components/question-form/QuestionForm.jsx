import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useNetworkVariables } from "../../config/networkConfig";
import Button from "../button/Button";
import styles from "./QuestionForm.module.css";
import { useContext, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import useCreateContent from "../../hooks/useCreateContent";
import QuestionPreview from "../../modals/question-preview/QuestionPreview";
import { WalletContext } from "../../context/walletContext";
import {
  FaPlus,
  FaTimes,
  FaExclamationTriangle,
  FaCoins,
} from "react-icons/fa";

const QuestionForm = () => {
  const { religySyncPackageId, platformId } = useNetworkVariables(
    "religySyncPackageId",
    "platformId"
  );
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [tradition, setTradition] = useState("");
  const [tags, setTags] = useState(["Meditation"]);
  const [newTag, setNewTag] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const navigate = useNavigate();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();
  const { balance } = useContext(WalletContext);

  // Use our custom hook for content creation
  const { createQuestion } = useCreateContent(
    religySyncPackageId,
    platformId,
    suiClient,
    signAndExecute
  );

  const addTag = () => {
    if (newTag && tags.length < 5 && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  function submitQuestion(e) {
    e.preventDefault();

    // Create metadata object
    const metadata = {
      tags: tags,
      tradition: tradition,
    };

    // Use our createQuestion function from the hook
    createQuestion(
      title,
      details,
      metadata,
      () => navigate("/questions") // Navigate on success
    );
  }

  const handleOpenPreview = (e) => {
    e.preventDefault();
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  const isFormValid = title && details && tradition;

  return (
    <>
      <Form
        method="post"
        className={styles["question-form"]}
        onSubmit={submitQuestion}
      >
        <div className={styles["token-info"]}>
          <div className={styles["token-balance"]}>
            <div className={styles["token-icon"]}>
              <FaCoins size={12} />
            </div>
            <span>Balance: {balance} SUI</span>
          </div>
        </div>

        <div className={styles["form-group"]}>
          <label className={styles["form-label"]}>
            Question Title
            <input
              type="text"
              name="title"
              className={styles["form-input"]}
              placeholder="What is your faith-related question?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <div className={styles["form-helper"]}>
            Create a clear, concise title for your question. (15-150 characters)
          </div>
        </div>

        <div className={styles["form-group"]}>
          <label className={styles["form-label"]}>
            Question Details
            <textarea
              name="details"
              className={styles["form-textarea"]}
              placeholder="Provide more context, background, or details about your question..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            ></textarea>
          </label>
          <div className={styles["form-helper"]}>
            Be specific and include any relevant context that would help
            scholars provide a comprehensive answer.
          </div>
        </div>

        <div className={styles["form-group"]}>
          <label className={styles["form-label"]}>
            Faith Tradition
            <select
              name="tradition"
              className={styles["form-select"]}
              value={tradition}
              onChange={(e) => setTradition(e.target.value)}
              required
            >
              <option value="" disabled>
                Select faith tradition
              </option>
              <option value="buddhism">Buddhism</option>
              <option value="christianity">Christianity</option>
              <option value="hinduism">Hinduism</option>
              <option value="islam">Islam</option>
              <option value="judaism">Judaism</option>
              <option value="sikhism">Sikhism</option>
              <option value="other">Other</option>
              <option value="interfaith">Interfaith / Comparative</option>
            </select>
          </label>
          <div className={styles["form-helper"]}>
            Choose the faith tradition most relevant to your question.
          </div>
        </div>

        <div className={styles["form-group"]}>
          <label className={styles["form-label"]}>
            Tags
            <div className={styles["tags-container"]}>
              {tags.map((tag, index) => (
                <div key={index} className={styles["tag-input"]}>
                  {tag}
                  <span
                    className={styles["remove-tag"]}
                    onClick={() => removeTag(tag)}
                  >
                    <FaTimes size={10} />
                  </span>
                </div>
              ))}
              <div className={styles["tag-input-container"]}>
                <input
                  type="text"
                  name="tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className={styles["tag-input-field"]}
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  className={styles["add-tag-btn"]}
                  onClick={addTag}
                  disabled={tags.length >= 5 || !newTag}
                >
                  <FaPlus size={12} /> Add
                </button>
              </div>
            </div>
          </label>
          <div className={styles["form-helper"]}>
            Add up to 5 tags to help categorize your question.
          </div>
        </div>

        {account ? (
          <div className={styles["submission-buttons"]}>
            <div className={styles["submission-cost"]}>
              Base cost: <strong>SUI Token</strong> + Gas fees
            </div>
            <div className={styles["button-group"]}>
              <Button
                type="button"
                text={"Preview"}
                btnClass={"secondary"}
                onClick={handleOpenPreview}
                disabled={!isFormValid}
              />
              <Button
                type="submit"
                text={isPending ? "Submitting..." : "Submit Question"}
                btnClass={"primary"}
                disabled={isPending || !isFormValid}
              />
            </div>
          </div>
        ) : (
          <div className={styles["submission-buttons"]}>
            <p className={styles["not-connected-message"]}>
              <FaExclamationTriangle /> You need to be connected to submit a
              question. Please connect your wallet to proceed.
            </p>
          </div>
        )}
      </Form>

      <QuestionPreview
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        title={title}
        details={details}
        tradition={tradition}
        tags={tags}
      />
    </>
  );
};

export default QuestionForm;
