import { useState } from "react";
import styles from "./ErrorState.module.css";

const ErrorState = ({
  message = "Something went wrong",
  details = "We couldn't load the content you requested",
  onRetry = null,
}) => {
  const [isShaking, setIsShaking] = useState(false);

  const handleRetry = () => {
    if (!onRetry) return;

    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
    onRetry();
  };

  return (
    <div className={styles.container}>
      <div className={styles.errorWrapper}>
        <div
          className={`${styles.hexagonGrid} ${isShaking ? styles.shake : ""}`}
        >
          <div className={`${styles.hexagon} ${styles.hex1}`}>!</div>
          <div className={`${styles.hexagon} ${styles.hex2}`}></div>
          <div className={`${styles.hexagon} ${styles.hex3}`}></div>
          <div className={`${styles.hexagon} ${styles.hex4}`}></div>
          <div className={`${styles.hexagon} ${styles.hex5}`}></div>
          <div className={`${styles.hexagon} ${styles.hex6}`}></div>
        </div>
        <div className={styles.pulseCircle}></div>
      </div>
      <h3 className={styles.title}>{message}</h3>
      <p className={styles.details}>{details}</p>
      {onRetry && (
        <button className={styles.retryButton} onClick={handleRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
