import styles from "./ProfileCard.module.css";
import PropTypes from "prop-types";

const ProfileCard = ({ data }) => {
  const { name, tradition, answers, votes } = data;
  return (
    <li className={styles.card}>
      <div className={styles.avatar}>VS</div>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.tradition}>{tradition}</p>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.value}>{answers}</div>
          <div>Answers</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.value}>{votes}</div>
          <div>Votes</div>
        </div>
      </div>
    </li>
  );
};

ProfileCard.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ProfileCard;
