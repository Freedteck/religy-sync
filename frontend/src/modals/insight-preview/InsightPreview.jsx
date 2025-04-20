import { useState, useEffect } from "react";
import styles from "./InsightPreview.module.css";
import Button from "../../components/button/Button";

const InsightPreview = ({
  isOpen,
  onClose,
  title,
  description,
  content,
  type,
  tradition,
  tags,
  thumbnailUrl,
  videoUrl,
}) => {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    setFormattedDate(now.toLocaleDateString("en-US", options));
  }, [isOpen]);

  // Map tradition value to display name
  const traditionMap = {
    buddhism: "Buddhism",
    christianity: "Christianity",
    hinduism: "Hinduism",
    islam: "Islam",
    judaism: "Judaism",
    sikhism: "Sikhism",
    interfaith: "Interfaith",
  };

  if (!isOpen) return null;

  return (
    <div className={styles.previewOverlay}>
      <div className={styles.previewModal}>
        <div className={styles.previewHeader}>
          <h2>Insight Preview</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.previewContent}>
          <div className={styles.typeBadgeContainer}>
            <span
              className={`${styles.typeBadge} ${
                type === "video" ? styles.videoBadge : ""
              }`}
            >
              {type}
            </span>
          </div>

          <div className={styles.insightTitle}>{title}</div>

          <div className={styles.insightMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Published:</span>{" "}
              {formattedDate}
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Tradition:</span>{" "}
              {traditionMap[tradition] || tradition}
            </div>
          </div>

          {thumbnailUrl && (
            <div className={styles.thumbnailPreview}>
              <img src={thumbnailUrl} alt="Insight thumbnail" />
            </div>
          )}

          <div className={styles.insightDescription}>{description}</div>

          {type === "video" && videoUrl ? (
            <div className={styles.videoPreview}>
              <iframe
                src={videoUrl}
                title="Insight video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className={styles.contentPreview}>
              {content.split("\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          )}

          <div className={styles.tagContainer}>
            {tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.previewFooter}>
          <Button
            type="button"
            text="Close Preview"
            btnClass="secondary"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default InsightPreview;
