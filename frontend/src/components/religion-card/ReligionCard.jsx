import styles from "./ReligionCard.module.css";

const ReligionCard = ({ religion }) => {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{religion.icon}</div>
      <h3 className={styles.name}>{religion.name}</h3>
      <p className={styles.followers}>{religion.followers} followers</p>
    </div>
  );
};

export default ReligionCard;
