import PropTypes from "prop-types";
import styles from "./Button.module.css";

const Button = ({ text, btnClass = "primary", disabled, onClick }) => {
  return (
    <button className={styles[btnClass]} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};

Button.propType = {
  text: PropTypes.oneOf(["primary", "secondary"]),
  btnClass: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default Button;
