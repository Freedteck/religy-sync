import { useState, useContext } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useNetworkVariables } from "../../config/networkConfig";
import Button from "../button/Button";
import styles from "./InsightForm.module.css";
import { Link, useNavigate } from "react-router-dom";
import useCreateContent from "../../hooks/useCreateContent";
import InsightPreview from "../../modals/insight-preview/InsightPreview";
import useScholarStatus from "../../hooks/useScholarStatus";
import toast from "react-hot-toast";
import { uploadMultiple } from "../../utils/pinataService";
import { WalletContext } from "../../context/walletContext";
import { FaPlus, FaTimes, FaUpload, FaLink, FaCoins } from "react-icons/fa";

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

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
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [videoInputMethod, setVideoInputMethod] = useState("file");
  const [thumbnailInputMethod, setThumbnailInputMethod] = useState("file");
  const [isUploading, setIsUploading] = useState(false);

  const { balance, isScholar } = useContext(WalletContext);
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

  const validateFileSize = (file) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit`);
      return false;
    }
    return true;
  };

  const handleFileChange = (file, setFileFunction, fileType) => {
    if (!file) return;

    if (!validateFileSize(file)) {
      const fileInput = document.getElementById(`${fileType}-upload`);
      if (fileInput) fileInput.value = "";
      return;
    }

    setFileFunction(file);
  };

  const addTag = () => {
    if (newTag && tags.length < 5 && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const submitInsight = async (e) => {
    e.preventDefault();

    if (
      thumbnailInputMethod === "file" &&
      thumbnailFile &&
      !validateFileSize(thumbnailFile)
    )
      return;
    if (
      type === "video" &&
      videoInputMethod === "file" &&
      videoFile &&
      !validateFileSize(videoFile)
    )
      return;

    setIsUploading(true);

    try {
      let finalThumbnailUrl = thumbnailUrl;
      let finalVideoUrl = videoUrl;

      const filesToUpload = [];
      const fileTypes = [];

      if (thumbnailInputMethod === "file" && thumbnailFile) {
        filesToUpload.push(thumbnailFile);
        fileTypes.push("thumbnail");
      }

      if (type === "video" && videoInputMethod === "file" && videoFile) {
        filesToUpload.push(videoFile);
        fileTypes.push("video");
      }

      if (filesToUpload.length > 0) {
        const uploadedUrls = await uploadMultiple(filesToUpload);

        // Assign URLs based on their original order
        fileTypes.forEach((type, index) => {
          if (type === "thumbnail") {
            finalThumbnailUrl = uploadedUrls[index];
          } else if (type === "video") {
            finalVideoUrl = uploadedUrls[index];
          }
        });
      }

      const metadata = {
        type,
        tradition,
        tags,
        thumbnailUrl: finalThumbnailUrl,
        description,
        videoUrl: type === "video" ? finalVideoUrl : undefined,
        tokenOffering: tokenAmount,
      };

      createInsight(scholarCapId, title, content, metadata, () =>
        navigate("/teachings")
      );
    } catch (error) {
      toast.error("Failed to upload files or publish insight");
      console.error("Submission error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenPreview = (e) => {
    e.preventDefault();
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  const isFormValid =
    title &&
    description &&
    content &&
    tradition &&
    (thumbnailInputMethod === "url" ? thumbnailUrl : thumbnailFile) &&
    (type === "article" ||
      (type === "video" &&
        ((videoInputMethod === "file" && videoFile) ||
          (videoInputMethod === "url" && videoUrl))));

  return (
    <>
      <form className={styles["insight-form"]} onSubmit={submitInsight}>
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
                  <FaUpload /> Upload Video
                </button>
                <button
                  type="button"
                  className={`${styles["toggle-option"]} ${
                    videoInputMethod === "url" ? styles["active"] : ""
                  }`}
                  onClick={() => setVideoInputMethod("url")}
                >
                  <FaLink /> Use URL
                </button>
              </div>
              {videoInputMethod === "file" ? (
                <div className={styles["file-upload-container"]}>
                  <input
                    type="file"
                    id="video-upload"
                    accept="video/*"
                    onChange={(e) =>
                      handleFileChange(e.target.files[0], setVideoFile, "video")
                    }
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
                        <span className={styles["upload-icon"]}>
                          <FaUpload size={20} />
                        </span>
                        <span>Click to select video file</span>
                        <span className={styles["file-hint"]}>
                          (MP4, WebM, max {MAX_FILE_SIZE_MB}MB)
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
                ? `Upload your video file (max ${MAX_FILE_SIZE_MB}MB)`
                : "Paste a video embed URL (YouTube, Vimeo, etc.)"}
            </div>
          </div>
        )}

        <div className={styles["form-group"]}>
          <label className={styles["form-label"]}>
            Thumbnail Image
            <div className={styles["video-method-toggle"]}>
              <button
                type="button"
                className={`${styles["toggle-option"]} ${
                  thumbnailInputMethod === "file" ? styles["active"] : ""
                }`}
                onClick={() => setThumbnailInputMethod("file")}
              >
                <FaUpload /> Upload Image
              </button>
              <button
                type="button"
                className={`${styles["toggle-option"]} ${
                  thumbnailInputMethod === "url" ? styles["active"] : ""
                }`}
                onClick={() => setThumbnailInputMethod("url")}
              >
                <FaLink /> Use URL
              </button>
            </div>
            {thumbnailInputMethod === "file" ? (
              <div className={styles["file-upload-container"]}>
                <input
                  type="file"
                  id="thumbnail-upload"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileChange(
                      e.target.files[0],
                      setThumbnailFile,
                      "thumbnail"
                    )
                  }
                  className={styles["file-input"]}
                  required={thumbnailInputMethod === "file"}
                />
                <label
                  htmlFor="thumbnail-upload"
                  className={styles["file-upload-label"]}
                >
                  {thumbnailFile ? (
                    <>
                      <span className={styles["file-name"]}>
                        {thumbnailFile.name}
                      </span>
                      <span className={styles["file-size"]}>
                        {(thumbnailFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </>
                  ) : (
                    <>
                      <span className={styles["upload-icon"]}>
                        <FaUpload size={20} />
                      </span>
                      <span>Click to select image file</span>
                      <span className={styles["file-hint"]}>
                        (JPG, PNG, max {MAX_FILE_SIZE_MB}MB)
                      </span>
                    </>
                  )}
                </label>
              </div>
            ) : (
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className={styles["url-input"]}
                required={thumbnailInputMethod === "url"}
              />
            )}
          </label>
          <div className={styles["form-helper"]}>
            {thumbnailInputMethod === "file"
              ? `Upload your thumbnail image (max ${MAX_FILE_SIZE_MB}MB)`
              : "Paste an image URL"}
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
                    <FaTimes size={10} />
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
                    <FaPlus size={12} /> Add
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

        {isScholar ? (
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
                disabled={!isFormValid || isUploading}
              />
              <Button
                type="submit"
                text={
                  isUploading
                    ? "Uploading files..."
                    : isPending
                    ? "Publishing..."
                    : "Publish Insight"
                }
                btnClass={"primary"}
                disabled={isPending || !isFormValid || isUploading}
              />
            </div>
          </div>
        ) : (
          <div className={styles["submission-buttons"]}>
            <p className={styles["not-scholar-message"]}>
              You need to be a verified scholar to publish insights.
              <Link to={"/scholar-application"}>Apply now</Link>
            </p>
          </div>
        )}
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
        thumbnailUrl={
          thumbnailInputMethod === "file" && thumbnailFile
            ? URL.createObjectURL(thumbnailFile)
            : thumbnailUrl
        }
        videoUrl={
          type === "video" && videoInputMethod === "file" && videoFile
            ? URL.createObjectURL(videoFile)
            : videoUrl
        }
      />
    </>
  );
};

export default InsightForm;
