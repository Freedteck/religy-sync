// LoadingState.jsx
import styles from "./Loading.module.css";

const Loading = ({ message = "Loading your Web3 experience..." }) => {
  return (
    <div className={styles.container}>
      <div className={styles.loadingWrapper}>
        <div className={styles.hexagonGrid}>
          <div className={`${styles.hexagon} ${styles.hex1}`}></div>
          <div className={`${styles.hexagon} ${styles.hex2}`}></div>
          <div className={`${styles.hexagon} ${styles.hex3}`}></div>
          <div className={`${styles.hexagon} ${styles.hex4}`}></div>
          <div className={`${styles.hexagon} ${styles.hex5}`}></div>
          <div className={`${styles.hexagon} ${styles.hex6}`}></div>
          <div className={`${styles.hexagon} ${styles.hex7}`}></div>
        </div>
        <div className={styles.pulseCircle}></div>
      </div>
      <p className={styles.message}>{message}</p>
      <div className={styles.progressBar}>
        <div className={styles.progress}></div>
      </div>
    </div>
  );
};

export default Loading;
