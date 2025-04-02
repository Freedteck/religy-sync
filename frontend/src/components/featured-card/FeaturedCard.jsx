import PropTypes from "prop-types";
import styles from "./FeaturedCard.module.css";

const FeaturedCard = ({ data }) => {
  const { title, excerpt, answeredBy, votes, tags } = data;
  return (
    <li className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.excerpt}>
        {excerpt.length > 200 ? `${excerpt.slice(0, 100)}...` : excerpt}
      </p>
      <div className={styles.meta}>
        <p>Answered by: {answeredBy}</p>
        <p>{votes} helpful votes</p>
      </div>
      <div className={styles.tags}>
        {tags.map((tag, index) => (
          <div key={index} className={styles.tag}>
            {tag}
          </div>
        ))}
      </div>
    </li>
  );
};

FeaturedCard.propTypes = {
  data: PropTypes.object.isRequired,
};

export default FeaturedCard;
