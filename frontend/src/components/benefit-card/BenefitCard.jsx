import styles from "./BenefitCard.module.css";
const BenefitCard = ({ icon, title, text }) => {
  return (
    <div className={styles["benefit-card"]}>
      <div className={styles["benefit-icon"]}>{icon}</div>
      <h3 className={styles["benefit-title"]}>{title}</h3>
      <p className={styles["benefit-text"]}>{text}</p>
    </div>
  );
};

export default BenefitCard;
