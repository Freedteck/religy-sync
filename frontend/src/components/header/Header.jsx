import styles from "./Header.module.css";
import { Link, NavLink } from "react-router-dom";
const Header = () => {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        ReligySync
      </Link>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/questions"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Questions
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/scholars"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Scholars
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              About/FAQ
            </NavLink>
          </li>
          <li className={styles.connect}>
            <NavLink
              to="/connect"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Connect
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
