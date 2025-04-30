import PropTypes from "prop-types";
import styles from "./Button.module.css";

const Button = ({
  text,
  btnClass = "primary",
  disabled = false,
  onClick,
  icon = "",
}) => {
  return (
    <button
      className={`${styles.btn} ${styles[btnClass]}`}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {text}
      {icon && <span className={styles.icon}>{icon}</span>}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  btnClass: PropTypes.oneOf(["primary", "secondary"]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
};

export default Button;
