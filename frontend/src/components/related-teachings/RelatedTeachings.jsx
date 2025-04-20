import TeachingCard from "../teaching-card/TeachingCard";
import styles from "./RelatedTeachings.module.css";

const RelatedTeachings = ({ insights }) => {
  if (!insights.length) return null;

  return (
    <section className={styles.relatedSection}>
      <h2 className={styles.sectionHeading}>Related Insights</h2>
      <div className={styles.relatedGrid}>
        {insights.map((insight) => (
          <TeachingCard key={insight.id} teaching={insight} />
        ))}
      </div>
    </section>
  );
};

export default RelatedTeachings;
