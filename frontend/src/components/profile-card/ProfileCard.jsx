import styles from "./ProfileCard.module.css";
import PropTypes from "prop-types";
import { truncateAddress } from "../../utils/truncateAddress";
import { Link } from "react-router-dom";

const ProfileCard = ({ data }) => {
  const { name, faithTradition, status, applicant } = data;

  return (
    <li className={styles.card}>
      <Link to={`profile/${applicant}`}>
        <div className={styles.avatar}>
          {name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()}
        </div>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.tradition}>{faithTradition || "N/A"}</p>
        <div className={styles.stats}>
          <div className={styles.status}>
            <p className={styles.verified}>{status}</p>
          </div>
          <div className={styles.stat}>
            <div className={styles.value}>{truncateAddress(applicant)}</div>
          </div>
        </div>
      </Link>
    </li>
  );
};

ProfileCard.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ProfileCard;
