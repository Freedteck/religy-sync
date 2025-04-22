import { Link } from "react-router-dom";
import styles from "./RelatedQuestions.module.css";

const RelatedQuestions = ({ relatedQuestions }) => {
  return (
    <div className={styles["related-questions"]}>
      <h3 className={styles["related-title"]}>Related Questions</h3>
      <div className={styles["related-list"]}>
        {relatedQuestions.map((relatedQ) => (
          <div className={styles["related-item"]} key={relatedQ.data.objectId}>
            <Link
              to={`/questions/${relatedQ.data.objectId}`}
              className={styles["related-link"]}
            >
              {relatedQ.data.content.fields.title}
            </Link>
          </div>
        ))}
      </div>
      {relatedQuestions.length === 0 && (
        <p className={styles["no-related"]}>No related questions available.</p>
      )}
    </div>
  );
};

export default RelatedQuestions;
