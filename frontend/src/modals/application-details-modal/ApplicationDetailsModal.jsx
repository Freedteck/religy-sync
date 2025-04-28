import { useEffect } from "react";
import styles from "./ApplicationDetailsModal.module.css";
import { parseMetadata } from "../../utils/helpers";
import { formatTime } from "../../utils/timeFormatter";

const ApplicationDetailsModal = ({
  show,
  application,
  onClose,
  onApprove,
  onReject,
}) => {
  useEffect(() => {
    console.log("app", application);
  }, [application]);

  if (!show || !application) return null;

  const shortAddress = `${application.applicant.substring(
    0,
    6
  )}...${application.applicant.slice(-4)}`;
  const info = parseMetadata(application.additionalInfo || "");

  // Extract filename from URL or use a default text
  const getFilenameFromUrl = (url) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      return pathParts[pathParts.length - 1] || "Credentials Document";
    } catch {
      return "Credentials Document";
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.applicationDetail}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.detailHeader}>
          <div className={styles.detailTitle}>
            Application Details: {shortAddress}
          </div>
          <div className={styles.detailActions}>
            {application.status === "pending" && (
              <>
                <button
                  className={`${styles.btn} ${styles.btnSuccess}`}
                  onClick={() => onApprove(application.applicant)}
                >
                  Approve
                </button>
                <button
                  className={`${styles.btn} ${styles.btnDanger}`}
                  onClick={() => onReject(application.applicant)}
                >
                  Reject
                </button>
              </>
            )}
            <button
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={onClose}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className={styles.detailContent}>
          <div className={styles.detailField}>
            <span className={styles.fieldLabel}>Applicant Address</span>
            <div className={styles.fieldValue}>{application.applicant}</div>
          </div>

          <div className={styles.detailField}>
            <span className={styles.fieldLabel}>Full Name</span>
            <div className={styles.fieldValue}>{application.name || "N/A"}</div>
          </div>

          <div className={styles.detailField}>
            <span className={styles.fieldLabel}>Faith Tradition</span>
            <div className={styles.fieldValue}>
              {application.faith_tradition || "N/A"}
            </div>
          </div>

          <div className={styles.detailField}>
            <span className={styles.fieldLabel}>Applied On</span>
            <div className={styles.fieldValue}>
              {formatTime(application.timestamp)}
            </div>
          </div>

          <div className={`${styles.detailField} ${styles.fieldTextarea}`}>
            <span className={styles.fieldLabel}>Credentials</span>
            <div className={styles.fieldValue}>
              {application.credentials || "No credentials provided"}
            </div>
          </div>

          {/* Credentials Document Link */}
          {info?.credentialsDocUrl && (
            <div className={styles.detailField}>
              <span className={styles.fieldLabel}>Credentials Document</span>
              <div className={styles.fieldValue}>
                <a
                  href={info.credentialsDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.documentLink}
                >
                  <i className="fas fa-file-alt"></i>
                  {getFilenameFromUrl(info.credentialsDocUrl)}
                </a>
              </div>
            </div>
          )}

          <div className={`${styles.detailField} ${styles.fieldTextarea}`}>
            <span className={styles.fieldLabel}>Additional Information</span>
            <div className={styles.fieldValue}>
              {info && Object.keys(info).length > 0 ? (
                <ul className={styles.additionalInfoList}>
                  {info.email && (
                    <li>
                      <strong>Email: </strong> {info.email}
                    </li>
                  )}
                  {info.denomination && (
                    <li>
                      <strong>Denomination: </strong> {info.denomination}
                    </li>
                  )}
                  {info.expertise?.length > 0 && (
                    <li>
                      <strong>Expertise: </strong> {info.expertise.join(", ")}
                    </li>
                  )}
                  {info.otherExpertise && (
                    <li>
                      <strong>Other Expertise: </strong> {info.otherExpertise}
                    </li>
                  )}
                </ul>
              ) : (
                "No additional information provided"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsModal;
