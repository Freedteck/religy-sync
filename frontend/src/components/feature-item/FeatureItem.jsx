import styles from "./FeatureItem.module.css";
const FeatureItem = ({ icon, title, description }) => {
  return (
    <li className={styles["feature-item"]}>
      <div className={styles["feature-icon"]}>{icon}</div>
      <div className={styles["feature-text"]}>
        <div className={styles["feature-title"]}>{title}</div>
        <div className={styles["feature-description"]}>{description}</div>
      </div>
    </li>
  );
};

export default FeatureItem;
