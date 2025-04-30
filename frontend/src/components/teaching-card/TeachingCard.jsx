import { Link } from "react-router-dom";
import styles from "./TeachingCard.module.css";
import { formatObjectId, parseMetadata } from "../../utils/helpers";
import { formatTime } from "../../utils/timeFormatter";
import Jazzicon from "react-jazzicon";
import { FaHeart, FaCalendarAlt } from "react-icons/fa";

const TeachingCard = ({ teaching, featured = false }) => {
  return (
    <Link
      to={`/teachings/${teaching?.data?.objectId}`}
      className={`${styles.card} ${featured ? styles.featuredCard : ""}`}
    >
      <div className={styles.thumbnail}>
        <img
          src={
            parseMetadata(teaching?.data?.content?.fields.metadata).thumbnailUrl
          }
          alt={teaching?.data?.content?.fields.title}
        />
        <span
          className={`${styles.typeBadge} ${
            parseMetadata(teaching?.data?.content?.fields.metadata).type ===
            "video"
              ? styles.videoBadge
              : ""
          }`}
        >
          {parseMetadata(teaching?.data?.content?.fields.metadata).type}
        </span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>
          {teaching?.data?.content?.fields.title}
        </h3>
        <p className={styles.description}>
          {parseMetadata(teaching?.data?.content?.fields.metadata).description}
        </p>
        <div className={styles.meta}>
          <div className={styles.scholarInfo}>
            <Jazzicon
              diameter={30}
              seed={parseInt(
                teaching?.data?.content?.fields.creator.slice(2, 8),
                16
              )}
            />
            <span className={styles.scholarName}>
              {formatObjectId(teaching?.data?.content?.fields.creator)}
            </span>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <FaHeart className={styles.actionIcon} />
              {teaching?.data?.content?.fields.likes}
            </div>
            {featured && (
              <div className={styles.stat}>
                <FaCalendarAlt className={styles.actionIcon} />
                {formatTime(teaching?.timestampMs)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TeachingCard;
