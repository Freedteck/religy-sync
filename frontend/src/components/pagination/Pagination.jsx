import styles from "./Pagination.module.css";
import PropTypes from "prop-types";

const Pagination = ({ currentPage, pages }) => {
  return (
    <div className={styles.pagination}>
      <button className={styles["page-button"]} disabled={currentPage === 1}>
        «
      </button>
      {Array.from({ length: pages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          className={`${styles["page-button"]} ${
            currentPage === page ? styles["active"] : ""
          }`}
        >
          {page}
        </button>
      ))}
      <button
        className={styles["page-button"]}
        disabled={currentPage === pages}
      >
        »
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  pages: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Pagination;
