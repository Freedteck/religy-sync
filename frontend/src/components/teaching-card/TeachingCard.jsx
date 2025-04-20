import { Link } from "react-router-dom";
import styles from "./TeachingCard.module.css";
import { formatObjectId, parseMetadata } from "../../utils/helpers";
import { formatTime } from "../../utils/timeFormatter";
import Jazzicon from "react-jazzicon";

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
            {/* <img
              src={teaching?.scholar?.avatar}
              alt={teaching?.data?.content?.fields.creator}
            /> */}
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
              <svg className={styles.actionIcon} viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {teaching?.data?.content?.fields.likes}
            </div>
            {featured && (
              <div className={styles.stat}>
                📅 {formatTime(teaching?.timestampMs)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TeachingCard;
