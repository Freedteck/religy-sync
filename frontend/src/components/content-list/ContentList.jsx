import { formatTime } from "../../utils/timeFormatter";
import styles from "./ContentList.module.css";
import { Link } from "react-router-dom";

const ContentList = ({ items, type, showQuestionLink = false }) => {
  return (
    <div className={styles.contentList}>
      {items.map((item, index) => {
        const content = item.data.content.fields;
        const timestamp = formatTime(item.timestampMs);
        const linkTo =
          type === "prayer"
            ? `/prayers`
            : `/questions/${
                type === "question" ? content.id.id : content.related_to
              }`;

        return (
          <Link to={linkTo} key={index} className={styles.contentItemLink}>
            <div className={styles.contentItem}>
              <div className={styles.contentHeader}>
                <h3>
                  {type === "answer" && showQuestionLink && (
                    <span className={styles.questionLink}>
                      Answer to:{" "}
                      <span className={styles.inlineLink}>{content.title}</span>
                    </span>
                  )}
                  {type === "question" && content.title}
                </h3>
                <div className={styles.contentMeta}>
                  <span className={styles.contentDate}>{timestamp}</span>
                  <span className={styles.contentLikes}>
                    👍 {content.likes || 0}
                  </span>
                </div>
              </div>
              <div className={styles.contentBody}>{content.body}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ContentList;
