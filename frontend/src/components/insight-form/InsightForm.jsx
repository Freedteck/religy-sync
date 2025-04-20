import { useState, useEffect } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useNetworkVariables } from "../../config/networkConfig";
import Button from "../button/Button";
import styles from "./InsightForm.module.css";
import { useNavigate } from "react-router-dom";
import useCreateContent from "../../hooks/useCreateContent";
import InsightPreview from "../../modals/insight-preview/InsightPreview";
import useScholarStatus from "../../hooks/useScholarStatus";

const InsightForm = () => {
  const { religySyncPackageId, platformId } = useNetworkVariables(
    "religySyncPackageId",
    "platformId"
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("article");
  const [tradition, setTradition] = useState("");
  const [tags, setTags] = useState(["Spirituality"]);
  const [newTag, setNewTag] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [videoInputMethod, setVideoInputMethod] = useState("file"); // 'file' or 'url'

  const navigate = useNavigate();
  const suiClient = useSuiClient();
  const { mutate: signAndExecute, isPending } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();

  const { createInsight } = useCreateContent(
    religySyncPackageId,
    platformId,
    suiClient,
    signAndExecute
  );

  const { scholarCapId } = useScholarStatus(
    suiClient,
    religySyncPackageId,
    platformId,
    account
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

  const submitInsight = (e) => {
    e.preventDefault();

    const metadata = {
      type,
      tradition,
      tags,
      thumbnailUrl,
      description,
      videoUrl:
        type === "video"
          ? videoInputMethod === "url"
            ? videoUrl
            : URL.createObjectURL(videoFile)
          : undefined,
      tokenOffering: tokenAmount,
    };

    createInsight(scholarCapId, title, content, metadata, () =>
      navigate("/teachings")
    );
  };

  const handleOpenPreview = (e) => {
    e.preventDefault();
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (account && suiClient) {
        try {
          const { totalBalance } = await suiClient.getBalance({
            owner: account.address,
          });
          setBalance((Number(totalBalance) / 1_000_000_000).toFixed(2));
        } catch (err) {
          console.error("Error fetching balance:", err);
        }
      }
    };

    fetchBalance();
  }, [account, suiClient]);

  const isFormValid =
    title &&
    description &&
    content &&
    tradition &&
    (type === "article" ||
      (type === "video" &&
        ((videoInputMethod === "file" && videoFile) ||
          (videoInputMethod === "url" && videoUrl)))) &&
    thumbnailUrl;

  return (
    <>
      <form className={styles["insight-form"]} onSubmit={submitInsight}>
        <div className={styles["token-info"]}>
          <div className={styles["token-balance"]}>
            <div className={styles["token-icon"]}></div>
            <span>Balance: {balance} SUI</span>
          </div>
        </div>

        <div className={styles["form-group"]}>
          <label className={styles["form-label"]}>
            Insight Title
            <input
              type="text"
              className={styles["form-input"]}
              placeholder="Title of your insight or teaching"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <div className={styles["form-helper"]}>
            Create a clear, engaging title for your insight (15-150 characters)
          </div>
        </div>

        <div className={styles["form-group"]}>
          <label className={styles["form-label"]}>
            Short Description
            <textarea
              className={styles["form-textarea"]}
              placeholder="Brief description that will appear in listings..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
            />
          </label>
          <div className={styles["form-helper"]}>
            This will be shown in insight cards and previews (max 200
            characters)
          </div>
        </div>

        <div className={styles["form-group"]}>
          <label className={styles["form-label"]}>
            Content Type
            <select
              className={styles["form-select"]}
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="article">Article</option>
              <option value="video">Video</option>
            </select>
          </label>
        </div>

        {type === "video" && (
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>
              Video Content
              <div className={styles["video-method-toggle"]}>
                <button
                  type="button"
                  className={`${styles["toggle-option"]} ${
                    videoInputMethod === "file" ? styles["active"] : ""
                  }`}
                  onClick={() => setVideoInputMethod("file")}
                >
                  Upload Video
                </button>
                <button
                  type="button"
                  className={`${styles["toggle-option"]} ${
                    videoInputMethod === "url" ? styles["active"] : ""
                  }`}
                  onClick={() => setVideoInputMethod("url")}
                >
                  Use URL
                </button>
              </div>
              {videoInputMethod === "file" ? (
                <div className={styles["file-upload-container"]}>
                  <input
                    type="file"
                    id="video-upload"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    className={styles["file-input"]}
                    required={videoInputMethod === "file"}
                  />
                  <label
                    htmlFor="video-upload"
                    className={styles["file-upload-label"]}
                  >
                    {videoFile ? (
                      <>
                        <span className={styles["file-name"]}>
                          {videoFile.name}
                        </span>
                        <span className={styles["file-size"]}>
                          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </>
                    ) : (
                      <>
                        <span className={styles["upload-icon"]}>📁</span>
                        <span>Click to select video file</span>
                        <span className={styles["file-hint"]}>
                          (MP4, WebM, max 100MB)
                        </span>
                      </>
                    )}
                  </label>
                </div>
              ) : (
                <input
                  type="url"
                  placeholder="https://youtube.com/embed/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className={styles["url-input"]}
                  required={videoInputMethod === "url"}
                />
              )}
            </label>
            <div className={styles["form-helper"]}>
              {videoInputMethod === "file"
                ? "Upload your video file (max 100MB)"
                : "Paste a video embed URL (YouTube, Vimeo, etc.)"}
            </div>
          </div>
        )}

        <div className={styles["form-group"]}>
          <label className={styles["form-label"]}>
            Thumbnail Image URL
            <input
              type="url"
              className={styles["form-input"]}
              placeholder="https://example.com/image.jpg"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              required
            />
          </label>
          <div className={styles["form-helper"]}>
            Provide a high-quality image URL that represents your insight
          </div>
        </div>

        <div className={styles["form-group"]}>
          <label className={styles["form-label"]}>
            Full Content
            <textarea
              className={styles["form-textarea"]}
              placeholder="Write your full insight content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={10}
            />
          </label>
          <div className={styles["form-helper"]}>
            For articles, use markdown formatting. For videos, include a
            transcript or summary.
          </div>
        </div>

        <div className={styles["form-group"]}>
          <label className={styles["form-label"]}>
            Faith Tradition
            <select
              className={styles["form-select"]}
              value={tradition}
              onChange={(e) => setTradition(e.target.value)}
              required
            >
              <option value="" disabled>
                Select tradition
              </option>
              <option value="buddhism">Buddhism</option>
              <option value="christianity">Christianity</option>
              <option value="hinduism">Hinduism</option>
              <option value="islam">Islam</option>
              <option value="judaism">Judaism</option>
              <option value="sikhism">Sikhism</option>
              <option value="interfaith">Interfaith</option>
            </select>
          </label>
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
              {tags.length < 5 && (
                <div className={styles["tag-input-container"]}>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className={styles["tag-input-field"]}
                    placeholder="Add a tag"
                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                  />
                  <button
                    type="button"
                    className={styles["add-tag-btn"]}
                    onClick={addTag}
                    disabled={!newTag}
                  >
                    <span>+</span> Add
                  </button>
                </div>
              )}
            </div>
          </label>
          <div className={styles["form-helper"]}>
            Add up to 5 tags to help categorize your insight
          </div>
        </div>

        <div className={styles["form-group"]}>
          <label className={styles["form-label"]}>
            SUI Token Offering (Optional)
            <input
              type="number"
              className={styles["form-input"]}
              placeholder="0"
              min="0"
              step="0.1"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(parseFloat(e.target.value) || 0)}
            />
          </label>
          <div className={styles["form-helper"]}>
            Add SUI tokens to promote your insight to more users
          </div>
        </div>

        <div className={styles["submission-buttons"]}>
          <div className={styles["submission-cost"]}>
            Base cost: <strong>2 SUI</strong> + Gas fees
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
              text={isPending ? "Publishing..." : "Publish Insight"}
              btnClass={"primary"}
              disabled={isPending || !isFormValid}
            />
          </div>
        </div>
      </form>

      <InsightPreview
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        title={title}
        description={description}
        content={content}
        type={type}
        tradition={tradition}
        tags={tags}
        thumbnailUrl={thumbnailUrl}
        videoUrl={videoUrl}
      />
    </>
  );
};

export default InsightForm;
