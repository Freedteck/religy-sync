import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./Breadcrumb.module.css";

const Breadcrumb = ({ paths }) => (
  <div className={styles.breadcrumb}>
    {/* {paths.map((path, index) => (
      <span key={index}>
        {index !== 0 && <span className="breadcrumb-separator">›</span>}
        {path.link ? (
          <a href={path.link}>{path.name}</a>
        ) : (
          <span>{path.name}</span>
        )}
      </span>
    ))} */}
    <Link to="/">Home</Link>
    <span className={styles.separator}>›</span>
    <Link to="/questions">Questions</Link>
    <span className={styles.separator}>›</span>
    <span>Current Question</span>
  </div>
);

Breadcrumb.propTypes = {
  paths: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      link: PropTypes.string,
    })
  ),
};

export default Breadcrumb;
