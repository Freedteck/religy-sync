import PropTypes from "prop-types";
import styles from "./Button.module.css";

const Button = ({ text, btnClass = "primary", onClick }) => {
  return (
    <button className={styles[btnClass]} onClick={onClick}>
      {text}
    </button>
  );
};

Button.propType = {
  text: PropTypes.oneOf(["primary", "secondary"]),
  btnClass: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
