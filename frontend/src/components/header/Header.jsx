import { ConnectButton } from "@mysten/dapp-kit";
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
              to="/questions"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Questions
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Profile
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
          {/* <li className={styles.connect}>
            <NavLink
              to="/connect"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Connect
            </NavLink>
          </li> */}
          <ConnectButton />
        </ul>
      </nav>
    </header>
  );
};

export default Header;
