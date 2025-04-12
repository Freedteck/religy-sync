import styles from "./PersonalInfo.module.css";

const PersonalInfo = ({ formData, handleInputChange }) => {
  return (
    <div className={styles.formSection}>
      <h2 className={styles.formSectionTitle}>Personal Information</h2>

      <div className={styles.formGroup}>
        <label
          htmlFor="name"
          className={`${styles.formLabel} ${styles.required}`}
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className={styles.formInput}
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <div className={styles.formHint}>
          This name will be stored on the blockchain
        </div>
      </div>

      <div className={styles.formGroup}>
        <label
          htmlFor="email"
          className={`${styles.formLabel} ${styles.required}`}
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className={styles.formInput}
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <div className={styles.formHint}>
          For administrative contact only (not stored on-chain)
        </div>
      </div>

      <div className={styles.formGroup}>
        <label
          htmlFor="walletAddress"
          className={`${styles.formLabel} ${styles.required}`}
        >
          Sui Wallet Address
        </label>
        <input
          type="text"
          id="walletAddress"
          name="walletAddress"
          className={styles.formInput}
          value={formData.walletAddress}
          onChange={handleInputChange}
          required
        />
        <div className={styles.formHint}>
          Your verified scholar status and rewards will be linked to this
          address
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
