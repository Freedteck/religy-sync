import { useState, useEffect } from "react";
import styles from "./PrayerPreview.module.css";
import Button from "../../components/button/Button";

const PrayerPreview = ({
  isOpen,
  onClose,
  title,
  content,
  tradition,
  tags,
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

  if (!isOpen) return null;

  // Map tradition value to display name
  const traditionMap = {
    buddhism: "Buddhism",
    christianity: "Christianity",
    hinduism: "Hinduism",
    islam: "Islam",
    judaism: "Judaism",
    sikhism: "Sikhism",
    other: "Other",
    interfaith: "Interfaith / Universal",
  };

  return (
    <div className={styles.previewOverlay}>
      <div className={styles.previewModal}>
        <div className={styles.previewHeader}>
          <h2>Prayer Preview</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.previewContent}>
          <div className={styles.prayerTitle}>{title}</div>

          <div className={styles.prayerMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Posted:</span> {formattedDate}
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Tradition:</span>{" "}
              {traditionMap[tradition] || tradition}
            </div>
          </div>

          <div className={styles.prayerBody}>{content}</div>

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

export default PrayerPreview;
