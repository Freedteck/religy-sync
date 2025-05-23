import styles from "./Review.module.css";
import { formatAddress } from "@mysten/sui/utils";

const Review = ({ formData, handleInputChange }) => {
  // Format expertise areas for display
  const expertiseAreas = Object.keys(formData.expertise)
    .filter((key) => formData.expertise[key])
    .map((key) => {
      const formatted = key.charAt(0).toUpperCase() + key.slice(1);
      return formatted;
    })
    .join(", ");

  return (
    <div className={styles.formSection}>
      <h2 className={styles.formSectionTitle}>Review Your Application</h2>

      <div className={styles.reviewSection}>
        <h3>Personal Information</h3>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Name:</span>
          <span className={styles.reviewValue}>{formData.name}</span>
        </div>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Email:</span>
          <span className={styles.reviewValue}>{formData.email}</span>
        </div>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Wallet Address:</span>
          <span className={styles.reviewValue}>
            {formatAddress(formData.walletAddress)}
          </span>
        </div>
      </div>

      <div className={styles.reviewSection}>
        <h3>Credentials & Faith Tradition</h3>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Faith Tradition:</span>
          <span className={styles.reviewValue}>{formData.faithTradition}</span>
        </div>
        {formData.denomination && (
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Denomination:</span>
            <span className={styles.reviewValue}>{formData.denomination}</span>
          </div>
        )}
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Credentials:</span>
          <span className={styles.reviewValue}>{formData.credentials}</span>
        </div>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Supporting Document:</span>
          <span className={styles.reviewValue}>
            {formData.credentialsDoc
              ? formData.credentialsDoc.name
              : "None uploaded"}
          </span>
        </div>
      </div>

      <div className={styles.reviewSection}>
        <h3>Areas of Expertise</h3>
        <div className={styles.reviewItem}>
          <span className={styles.reviewLabel}>Primary Areas:</span>
          <span className={styles.reviewValue}>
            {expertiseAreas || "None selected"}
          </span>
        </div>
        {formData.otherExpertise && (
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Other Areas:</span>
            <span className={styles.reviewValue}>
              {formData.otherExpertise}
            </span>
          </div>
        )}
      </div>

      {formData.additionalInfo && (
        <div className={styles.reviewSection}>
          <h3>Additional Information</h3>
          <div className={styles.reviewText}>{formData.additionalInfo}</div>
        </div>
      )}

      <div className={styles.formGroup}>
        <div className={styles.checkboxItem}>
          <input
            type="checkbox"
            id="agreeTerms"
            name="agreeTerms"
            className={styles.formCheckbox}
            checked={formData.agreeTerms}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="agreeTerms">
            I confirm that all information provided is truthful and accurate,
            and I agree to the ReligySync{" "}
            <a href="#" className={styles.accentLink}>
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className={styles.accentLink}>
              Community Guidelines
            </a>
          </label>
        </div>
      </div>

      <div className={styles.formNote}>
        <p>
          <strong>Note:</strong> Upon submission, your application will be
          reviewed by platform administrators. If approved, you will receive a
          ScholarCap NFT that grants you special permissions on the ReligySync
          platform.
        </p>
      </div>
    </div>
  );
};

export default Review;
