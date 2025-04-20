import PropTypes from "prop-types";
import styles from "./FeaturedCard.module.css";
import { parseMetadata } from "../../utils/helpers";
import { truncateAddress } from "../../utils/truncateAddress";

const FeaturedCard = ({ data }) => {
  const { title, body, creator, likes, metadata } = data.data.content.fields;
  return (
    <li className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.excerpt}>
        {body.length > 200 ? `${body.slice(0, 100)}...` : body}
      </p>
      <div className={styles.meta}>
        <p>By: {truncateAddress(creator)}</p>
        <p>{likes} helpful votes</p>
      </div>
      <div className={styles.tags}>
        {parseMetadata(metadata).tags.map((tag, index) => (
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
