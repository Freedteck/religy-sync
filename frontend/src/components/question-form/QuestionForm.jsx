import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariables } from "../../config/networkConfig";
import Button from "../button/Button";
import styles from "./QuestionForm.module.css";
import { Transaction } from "@mysten/sui/transactions";
import { useEffect, useState } from "react";

const QuestionForm = () => {
  const { religySyncPackageId, platformId } = useNetworkVariables(
    "religySyncPackageId",
    "platformId"
  );
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [tradition, setTradition] = useState("");
  const [tags, setTags] = useState(["Buddhism", "Meditation"]);
  const [newTag, setNewTag] = useState("");
  const [tokenAmount, setTokenAmount] = useState(0);
  const [preferredScholar, setPreferredScholar] = useState("");

  useEffect(() => {
    console.log("Package ID:", religySyncPackageId);
    console.log("Platform ID:", platformId);
  }, [religySyncPackageId, platformId]);

  const suiClient = useSuiClient();

  const {
    mutate: signAndExecute,
    isSuccess,
    isPending,
  } = useSignAndExecuteTransaction();

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
    console.log("Submitting question...");

    // Create metadata JSON string
    const metadata = JSON.stringify({
      tags: tags,
      tradition: tradition || "Buddhism",
      preferredScholar: preferredScholar || null,
      tokenOffering: tokenAmount,
    });

    // For testing, we'll use hardcoded values if the form is empty
    const questionTitle =
      title ||
      "What is the difference between Theravada and Mahayana Buddhism?";
    const questionDetails =
      details ||
      `I understand that these are two major schools of Buddhism, but I'm not clear on their main differences in terms of teachings, practices, and historical development. Could someone explain the key distinctions between these traditions?
      I'm especially interested in understanding:
      Core philosophical differences
      Different approaches to enlightenment
      Historical origins and geographic spread
      Major texts and authoritative sources
      Any scholarly insights would be greatly appreciated. Thank you!`;

    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(platformId),
        tx.pure.string(questionTitle),
        tx.pure.string(questionDetails),
        tx.pure.string(metadata), // Convert JSON object to string for metadata
      ],
      target: `${religySyncPackageId}::religy_sync::create_question`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async ({ digest }) => {
          const { effects } = await suiClient.waitForTransaction({
            digest: digest,
            options: {
              showEffects: true,
            },
          });

          console.log(
            "Created object ID:",
            effects?.created?.[0]?.reference?.objectId
          );
          console.log("Question submitted successfully!");
        },
        onError: (error) => {
          console.error("Error submitting question:", error);
        },
      }
    );
  }

  return (
    <form className={styles["question-form"]}>
      <div className={styles["token-info"]}>
        <div className={styles["token-balance"]}>
          <div className={styles["token-icon"]}></div>
          <span>Balance: 245 SUI</span>
        </div>
      </div>

      <div className={styles["form-group"]}>
        <label htmlFor="question-title" className={styles["form-label"]}>
          Question Title
        </label>
        <input
          type="text"
          id="question-title"
          className={styles["form-input"]}
          placeholder="What is your faith-related question?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <div className={styles["form-helper"]}>
          Create a clear, concise title for your question. (15-150 characters)
        </div>
      </div>

      <div className={styles["form-group"]}>
        <label htmlFor="question-details" className={styles["form-label"]}>
          Question Details
        </label>
        <textarea
          id="question-details"
          className={styles["form-textarea"]}
          placeholder="Provide more context, background, or details about your question..."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          required
        ></textarea>
        <div className={styles["form-helper"]}>
          Be specific and include any relevant context that would help scholars
          provide a comprehensive answer.
        </div>
      </div>

      <div className={styles["form-group"]}>
        <label htmlFor="faith-tradition" className={styles["form-label"]}>
          Faith Tradition
        </label>
        <select
          id="faith-tradition"
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
        <div className={styles["form-helper"]}>
          Choose the faith tradition most relevant to your question.
        </div>
      </div>

      <div className={styles["form-group"]}>
        <label className={styles["form-label"]}>Tags</label>
        <div className={styles["tags-container"]}>
          {tags.map((tag, index) => (
            <div key={index} className={styles["tag-input"]}>
              {tag}{" "}
              <span
                className={styles["remove-tag"]}
                onClick={() => removeTag(tag)}
              >
                ×
              </span>
            </div>
          ))}
          <label className={styles["tag-input-container"]}>
            <input
              type="text"
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
          </label>
        </div>
        <div className={styles["form-helper"]}>
          Add up to 5 tags to help categorize your question.
        </div>
      </div>

      <div className={styles["form-group"]}>
        <label htmlFor="preferred-scholar" className={styles["form-label"]}>
          Preferred Scholar (Optional)
        </label>
        <select
          id="preferred-scholar"
          className={styles["form-select"]}
          value={preferredScholar}
          onChange={(e) => setPreferredScholar(e.target.value)}
        >
          <option value="">Any verified scholar</option>
          <option value="venerable-sumedho">Venerable Sumedho</option>
          <option value="imam-ahmad">Imam Ahmad</option>
          <option value="swami-vivekananda">Swami Vivekananda</option>
          <option value="rev-sarah-thompson">Rev. Sarah Thompson</option>
        </select>
        <div className={styles["form-helper"]}>
          You can request a specific scholar to answer your question (additional
          SUI tokens may be required).
        </div>
      </div>

      <div className={styles["form-group"]}>
        <label htmlFor="token-amount" className={styles["form-label"]}>
          SUI Token Offering (Optional)
        </label>
        <input
          type="number"
          id="token-amount"
          className={styles["form-input"]}
          placeholder="0"
          min="0"
          step="0.1"
          value={tokenAmount}
          onChange={(e) => setTokenAmount(parseFloat(e.target.value) || 0)}
        />
        <div className={styles["form-helper"]}>
          Add SUI tokens as an incentive for scholars to answer your question.
          Higher offerings often receive quicker responses.
        </div>
      </div>

      <div className={styles["submission-buttons"]}>
        <div className={styles["submission-cost"]}>
          Base cost: <strong>1 SUI</strong> + Gas fees
        </div>
        <div className={styles["button-group"]}>
          <Button type="button" text={"Preview"} btnClass={"secondary"} />
          <Button
            type="submit"
            text={isPending ? "Submitting..." : "Submit Question"}
            btnClass={"primary"}
            disabled={isPending}
            onClick={submitQuestion}
          />
        </div>
      </div>
    </form>
  );
};

export default QuestionForm;
