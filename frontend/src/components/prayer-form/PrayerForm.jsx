import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useNetworkVariables } from "../../config/networkConfig";
import Button from "../button/Button";
import styles from "./PrayerForm.module.css";
import { useContext, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import useCreateContent from "../../hooks/useCreateContent";
import PrayerPreview from "../../modals/prayer-preview/PrayerPreview";
import { WalletContext } from "../../context/walletContext";
import { FaCoins } from "react-icons/fa";

const PrayerForm = () => {
  const { religySyncPackageId, platformId } = useNetworkVariables(
    "religySyncPackageId",
    "platformId"
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tradition, setTradition] = useState("");
  const [tags, setTags] = useState(["Healing"]);
  const [newTag, setNewTag] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const navigate = useNavigate();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();
  const { balance } = useContext(WalletContext);

  // Use our custom hook for content creation
  const { createPrayer } = useCreateContent(
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

  function submitPrayer(e) {
    e.preventDefault();

    // Create metadata object
    const metadata = {
      tags: tags,
      tradition: tradition,
    };

    // Use our createPrayer function from the hook
    createPrayer(
      title,
      content,
      metadata,
      () => navigate("/prayers") // Navigate on success
    );
  }

  const handleOpenPreview = (e) => {
    e.preventDefault();
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  const isFormValid = title && content && tradition;

  return (
    <>
      <Form
        method="post"
        className={styles["prayer-form"]}
        onSubmit={submitPrayer}
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
            Prayer Title
            <input
              type="text"
              name="title"
              className={styles["form-input"]}
              placeholder="What is your prayer about?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <div className={styles["form-helper"]}>
            Create a clear, concise title for your prayer (15-150 characters)
          </div>
        </div>

        <div className={styles["form-group"]}>
          <label className={styles["form-label"]}>
            Prayer Content
            <textarea
              name="content"
              className={styles["form-textarea"]}
              placeholder="Pour out your heart in prayer..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </label>
          <div className={styles["form-helper"]}>
            Share your prayer with the community. Be as specific or general as
            you feel led.
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
              <option value="interfaith">Interfaith / Universal</option>
            </select>
          </label>
          <div className={styles["form-helper"]}>
            Choose the faith tradition most relevant to your prayer.
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
                    ×
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
                  <span>+</span> Add
                </button>
              </div>
            </div>
          </label>
          <div className={styles["form-helper"]}>
            Add up to 5 tags to help categorize your prayer (e.g., healing,
            gratitude, peace).
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
                text={isPending ? "Submitting..." : "Submit Prayer"}
                btnClass={"primary"}
                disabled={isPending || !isFormValid}
              />
            </div>
          </div>
        ) : (
          <div className={styles["submission-buttons"]}>
            <p className={styles["not-connected-message"]}>
              You need to be connected to submit a prayer. Please connect your
              wallet to proceed.
            </p>
          </div>
        )}
      </Form>

      <PrayerPreview
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        title={title}
        content={content}
        tradition={tradition}
        tags={tags}
      />
    </>
  );
};

export default PrayerForm;
