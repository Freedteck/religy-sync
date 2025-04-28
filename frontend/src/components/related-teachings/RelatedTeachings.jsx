import TeachingCard from "../teaching-card/TeachingCard";
import styles from "./RelatedTeachings.module.css";

const RelatedTeachings = ({ insights }) => {
  if (!insights.length) return null;
  if (insights.length === 0) {
    return (
      <section className={styles.relatedSection}>
        <h2 className={styles.sectionHeading}>Related Insights</h2>
        <div className={styles.emptyState}>
          <p>No related insights available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.relatedSection}>
      <h2 className={styles.sectionHeading}>Related Insights</h2>
      <div className={styles.relatedGrid}>
        {insights.map((insight) => (
          <TeachingCard key={insight?.data?.objectId} teaching={insight} />
        ))}
      </div>
    </section>
  );
};

export default RelatedTeachings;
