import styles from "./EmptyState.module.css";

const EmptyState = ({
  message = "Nothing to show yet",
  description = "There's no content matching your criteria",
  icon = "📭",
  actionText = null,
  onAction = null,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.emptyWrapper}>
        <div className={styles.iconContainer}>
          <span className={styles.icon}>{icon}</span>
          <div className={styles.pulseCircle}></div>
        </div>
        <h3 className={styles.title}>{message}</h3>
        <p className={styles.description}>{description}</p>
        {actionText && onAction && (
          <button className={styles.actionButton} onClick={onAction}>
            {actionText}
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
