import styles from "./Credentials.module.css";

const Credentials = ({ formData, handleInputChange, handleFileUpload }) => {
  return (
    <div className={styles.formSection}>
      <h2 className={styles.formSectionTitle}>Credentials</h2>

      <div className={styles.formGroup}>
        <label
          htmlFor="credentials"
          className={`${styles.formLabel} ${styles.required}`}
        >
          Religious Credentials
        </label>
        <textarea
          id="credentials"
          name="credentials"
          className={styles.formTextarea}
          value={formData.credentials}
          onChange={handleInputChange}
          required
          placeholder="List your educational background, ordination, or other relevant qualifications..."
        ></textarea>
        <div className={styles.formHint}>
          Format: Type (Degree/Ordination/Position), Institution, Year, Brief
          Description
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={`${styles.formLabel}`}>Supporting Document</label>
        <label className={styles.fileUpload} htmlFor="credentialsDoc">
          <div className={styles.fileUploadIcon}>+</div>
          <div className={styles.fileUploadText}>
            Upload credentials document
          </div>
          <div className={styles.formUploadHint}>
            PDF, JPG, PNG - Max 10MB (ordination certificate, degree, etc.)
          </div>
          <input
            type="file"
            id="credentialsDoc"
            name="credentialsDoc"
            onChange={handleFileUpload}
            accept="application/pdf,image/jpeg,image/png"
            style={{ display: "none" }}
          />
        </label>
        {formData.credentialsDoc && (
          <div className={styles.formHint}>
            Selected file: {formData.credentialsDoc.name}
          </div>
        )}
        <div className={styles.formHint}>
          Document verification is part of the review process (reference only,
          not stored on-chain)
        </div>
      </div>
    </div>
  );
};

export default Credentials;
