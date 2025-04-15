import { Link, NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <Link to="" className={styles.sidebarLogo}>
        ReligySync
      </Link>
      <ul className={styles.sidebarMenu}>
        <li>
          <NavLink
            to="dashboard"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="applications"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <i className="fas fa-user-graduate"></i> Scholar Applications
          </NavLink>
        </li>
        <li>
          <NavLink to="#">
            <i className="fas fa-check-circle"></i> Verified Scholars
          </NavLink>
        </li>
        <li>
          <NavLink to="#">
            <i className="fas fa-question-circle"></i> Content Management
          </NavLink>
        </li>
        <li>
          <NavLink to="#">
            <i className="fas fa-chart-line"></i> Analytics
          </NavLink>
        </li>
        <li>
          <NavLink to="#">
            <i className="fas fa-cog"></i> Settings
          </NavLink>
        </li>
        <li>
          <NavLink to="#">
            <i className="fas fa-sign-out-alt"></i> Logout
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
