import React from "react";
import styles from "./PrayerNote.module.css";
import { truncateAddress } from "../../utils/truncateAddress";
import { formatTime } from "../../utils/timeFormatter";

const PrayerNote = ({ data, rotationClass, onLike, onTip }) => {
  const { title, body, creator, likes, metadata } = data.data.content.fields;
  return (
    <div className={`${styles.note} ${styles[rotationClass]}`}>
      <h3 className={styles.noteTitle}>{title}</h3>
      <p className={styles.content}>{body}</p>
      <div className={styles["tags"]}>
        {JSON.parse(metadata).tags.map((tag, idx) => (
          <div className={styles.tag} key={idx}>
            {tag}
          </div>
        ))}
      </div>
      <div className={styles.meta}>
        <span className={styles.author}>{truncateAddress(creator)}</span>
        <span className={styles.date}>{formatTime(data.timestampMs)}</span>
      </div>
      <div className={styles.actions}>
        <button className={styles.likeBtn} onClick={onLike}>
          <span>✓</span>Like ({likes})
        </button>
        <button className={styles.tipBtn} onClick={onTip}>
          <span>🪙</span>Tip
        </button>
      </div>
    </div>
  );
};

export default PrayerNote;
