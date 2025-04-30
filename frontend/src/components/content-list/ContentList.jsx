import {
  FaThumbsUp,
  FaPrayingHands,
  FaQuestion,
  FaReply,
} from "react-icons/fa";
import { formatTime } from "../../utils/timeFormatter";
import styles from "./ContentList.module.css";
import { Link } from "react-router-dom";

const ContentList = ({ items, type, showQuestionLink = false }) => {
  const getTypeIcon = () => {
    switch (type) {
      case "prayer":
        return <FaPrayingHands size={14} />;
      case "question":
        return <FaQuestion size={14} />;
      case "answer":
        return <FaReply size={14} />;
      default:
        return null;
    }
  };

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
                <div className={styles.contentTypeIndicator}>
                  {getTypeIcon()}
                </div>
                <h3>
                  {type === "answer" && showQuestionLink && (
                    <span className={styles.questionLink}>
                      Answer to:{" "}
                      <span className={styles.inlineLink}>{content.title}</span>
                    </span>
                  )}
                  {type === "question" && content.title}
                  {type === "prayer" && "Prayer Note"}
                </h3>
                <div className={styles.contentMeta}>
                  <span className={styles.contentDate}>{timestamp}</span>
                  <span className={styles.contentLikes}>
                    <FaThumbsUp size={14} /> {content.likes || 0}
                  </span>
                </div>
              </div>
              <div className={styles.contentBody}>
                {content.body.length > 200
                  ? `${content.body.substring(0, 200)}...`
                  : content.body}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ContentList;
