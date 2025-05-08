// components/question-preview/QuestionPreview.jsx
import { useState, useEffect } from "react";
import styles from "./QuestionPreview.module.css";
import Button from "../../components/button/Button";

const QuestionPreview = ({
  isOpen,
  onClose,
  title,
  details,
  tradition,
  tags,
  preferredScholar,
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
    interfaith: "Interfaith / Comparative",
  };

  // Map scholar ID to display name
  const scholarMap = {
    "venerable-sumedho": "Venerable Sumedho",
    "imam-ahmad": "Imam Ahmad",
    "swami-vivekananda": "Swami Vivekananda",
    "rev-sarah-thompson": "Rev. Sarah Thompson",
    "": "Any verified scholar",
  };

  return (
    <div className={styles.previewOverlay}>
      <div className={styles.previewModal}>
        <div className={styles.previewHeader}>
          <h2>Question Preview</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.previewContent}>
          <div className={styles.questionTitle}>{title}</div>

          <div className={styles.questionMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Asked:</span> {formattedDate}
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Tradition:</span>{" "}
              {traditionMap[tradition] || tradition}
            </div>
            {preferredScholar && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Preferred Scholar:</span>{" "}
                {scholarMap[preferredScholar] || preferredScholar}
              </div>
            )}
          </div>

          <div className={styles.questionBody}>{details}</div>

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

export default QuestionPreview;
