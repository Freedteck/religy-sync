import styles from "./RelatedQuestions.module.css";

const RelatedQuestions = ({ relatedQuestions }) => {
  return (
    <div className={styles["related-questions"]}>
      <h3 className={styles["related-title"]}>Related Questions</h3>
      <div className={styles["related-list"]}>
        {relatedQuestions.map((relatedQ) => (
          <div className={styles["related-item"]} key={relatedQ.id}>
            <a
              href={`/questions/${relatedQ.id}`}
              className={styles["related-link"]}
            >
              {relatedQ.title}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedQuestions;
