import styles from "./ResponseForm.module.css";

const ResponseForm = ({ onSubmit, onCancel, placeholder }) => {
  return (
    <form className={styles["followup-form"]} onSubmit={onSubmit}>
      <textarea
        name="content"
        placeholder={placeholder}
        required
        className={styles["form-textarea"]}
      ></textarea>
      <div className={styles["form-actions"]}>
        <button type="submit" className={styles["submit-btn"]}>
          Submit
        </button>
        <button
          type="button"
          className={styles["cancel-btn"]}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ResponseForm;
