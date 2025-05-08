import {
  ConnectButton,
  useCurrentAccount,
  useCurrentWallet,
} from "@mysten/dapp-kit";
import styles from "./Header.module.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import Button from "../button/Button";

const Header = () => {
  const account = useCurrentAccount();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isConnected } = useCurrentWallet();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.logo}>
          <img src="/religy_sync.png" alt="Religy Sync Logo" width={60} />
          <span className={styles.logoText}>
            Religy <br />
            Sync
          </span>
        </Link>

        {/* Mobile menu button */}
        <button className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav
          className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ""}`}
        >
          <ul className={styles.navList}>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? styles.active : "")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/questions"
                className={({ isActive }) => (isActive ? styles.active : "")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Questions
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? styles.active : "")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About/FAQ
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/teachings"
                className={({ isActive }) => (isActive ? styles.active : "")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Teachings
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/prayers"
                className={({ isActive }) => (isActive ? styles.active : "")}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Prayer Wall
              </NavLink>
            </li>
            {isConnected && (
              <li className={styles.profileLink}>
                <NavLink
                  to={"/profile" + "/" + account?.address}
                  className={({ isActive }) => (isActive ? styles.active : "")}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUser className={styles.userIcon} />
                  <span>Profile</span>
                </NavLink>
              </li>
            )}

            <li className={styles.connectButton}>
              {isConnected ? (
                <div className={styles.btn}>
                  <ConnectButton className={styles.connectButton} />
                </div>
              ) : (
                <Button text={"Connect"} onClick={() => navigate("/connect")} />
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
