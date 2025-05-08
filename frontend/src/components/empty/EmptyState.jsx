import styles from "./EmptyState.module.css";
import {
  FaInbox, // For empty state
  FaSearch, // For search empty state
  FaExclamationTriangle, // For error state
  FaRegSadTear, // For sad/empty state
  FaPlus, // For action button
} from "react-icons/fa";

const EmptyState = ({
  message = "Nothing to show yet",
  description = "There's no content matching your criteria",
  icon = "search",
  actionText = null,
  onAction = null,
}) => {
  // Icon mapping
  const iconComponents = {
    inbox: <FaInbox className={styles.icon} />,
    search: <FaSearch className={styles.icon} />,
    error: <FaExclamationTriangle className={styles.icon} />,
    sad: <FaRegSadTear className={styles.icon} />,
    // Add more as needed
  };

  // Default to inbox if icon not found
  const IconComponent = iconComponents[icon] || iconComponents.inbox;

  return (
    <div className={styles.container}>
      <div className={styles.emptyWrapper}>
        <div className={styles.iconContainer}>
          {IconComponent}
          <div className={styles.pulseCircle}></div>
        </div>
        <h3 className={styles.title}>{message}</h3>
        <p className={styles.description}>{description}</p>
        {actionText && onAction && (
          <button className={styles.actionButton} onClick={onAction}>
            {actionText} {<FaPlus className={styles.actionIcon} />}
          </button>
        )}
      </div>
      <div className={styles.hexagons}>
        <div className={`${styles.hexagon} ${styles.hex1}`}></div>
        <div className={`${styles.hexagon} ${styles.hex2}`}></div>
        <div className={`${styles.hexagon} ${styles.hex3}`}></div>
        <div className={`${styles.hexagon} ${styles.hex4}`}></div>
      </div>
    </div>
  );
};

export default EmptyState;
