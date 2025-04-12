import styles from "./Tradition.module.css";

const Tradition = ({ formData, handleInputChange }) => {
  return (
    <div className={styles.formSection}>
      <h2 className={styles.formSectionTitle}>Faith Tradition & Expertise</h2>

      <div className={styles.formGroup}>
        <label
          htmlFor="faithTradition"
          className={`${styles.formLabel} ${styles.required}`}
        >
          Faith Tradition
        </label>
        <select
          id="faithTradition"
          name="faithTradition"
          className={styles.formSelect}
          value={formData.faithTradition}
          onChange={handleInputChange}
          required
        >
          <option value="">Select your faith tradition</option>
          <option value="Buddhism">Buddhism</option>
          <option value="Christianity">Christianity</option>
          <option value="Hinduism">Hinduism</option>
          <option value="Islam">Islam</option>
          <option value="Judaism">Judaism</option>
          <option value="Sikhism">Sikhism</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="denomination" className={styles.formLabel}>
          Denomination/Sect/School
        </label>
        <input
          type="text"
          id="denomination"
          name="denomination"
          className={styles.formInput}
          value={formData.denomination}
          onChange={handleInputChange}
          placeholder="E.g., Theravada, Catholic, Shia, Reform, etc."
        />
      </div>

      <div className={styles.formGroup}>
        <label className={`${styles.formLabel}`}>
          Areas of Expertise (select all that apply)
        </label>
        <div className={styles.checkboxes}>
          <div className={styles.checkboxItem}>
            <input
              type="checkbox"
              id="scripture"
              name="expertise.scripture"
              className={styles.formCheckbox}
              checked={formData.expertise.scripture}
              onChange={handleInputChange}
            />
            <label htmlFor="scripture">Scripture & Sacred Texts</label>
          </div>
          <div className={styles.checkboxItem}>
            <input
              type="checkbox"
              id="theology"
              name="expertise.theology"
              className={styles.formCheckbox}
              checked={formData.expertise.theology}
              onChange={handleInputChange}
            />
            <label htmlFor="theology">Theology & Philosophy</label>
          </div>
          <div className={styles.checkboxItem}>
            <input
              type="checkbox"
              id="ritual"
              name="expertise.ritual"
              className={styles.formCheckbox}
              checked={formData.expertise.ritual}
              onChange={handleInputChange}
            />
            <label htmlFor="ritual">Rituals & Practices</label>
          </div>
          <div className={styles.checkboxItem}>
            <input
              type="checkbox"
              id="history"
              name="expertise.history"
              className={styles.formCheckbox}
              checked={formData.expertise.history}
              onChange={handleInputChange}
            />
            <label htmlFor="history">Religious History</label>
          </div>
          <div className={styles.checkboxItem}>
            <input
              type="checkbox"
              id="ethics"
              name="expertise.ethics"
              className={styles.formCheckbox}
              checked={formData.expertise.ethics}
              onChange={handleInputChange}
            />
            <label htmlFor="ethics">Ethics & Moral Guidance</label>
          </div>
          <div className={styles.checkboxItem}>
            <input
              type="checkbox"
              id="mysticism"
              name="expertise.mysticism"
              className={styles.formCheckbox}
              checked={formData.expertise.mysticism}
              onChange={handleInputChange}
            />
            <label htmlFor="mysticism">Mysticism & Spirituality</label>
          </div>
          <div className={styles.checkboxItem}>
            <input
              type="checkbox"
              id="contemporary"
              name="expertise.contemporary"
              className={styles.formCheckbox}
              checked={formData.expertise.contemporary}
              onChange={handleInputChange}
            />
            <label htmlFor="contemporary">Contemporary Religious Issues</label>
          </div>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="otherExpertise" className={styles.formLabel}>
          Other Areas of Expertise
        </label>
        <input
          type="text"
          id="otherExpertise"
          name="otherExpertise"
          className={styles.formInput}
          value={formData.otherExpertise}
          onChange={handleInputChange}
          placeholder="Additional areas separated by commas"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="additionalInfo" className={`${styles.formLabel}`}>
          Additional Information
        </label>
        <textarea
          id="additionalInfo"
          name="additionalInfo"
          className={styles.formTextarea}
          value={formData.additionalInfo}
          onChange={handleInputChange}
          placeholder="Share any additional information about your religious background, experience, or published works..."
        ></textarea>
        <div className={styles.formHint}>
          Include years of experience, teachings, publications, or community
          roles
        </div>
      </div>
    </div>
  );
};

export default Tradition;
