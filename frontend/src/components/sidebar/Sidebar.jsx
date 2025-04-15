import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <Link to="" className={styles.sidebarLogo}>
        ReligySync
      </Link>
      <ul className={styles.sidebarMenu}>
        <li>
          <Link to="#" className={styles.active}>
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </Link>
        </li>
        <li>
          <Link to="#">
            <i className="fas fa-user-graduate"></i> Scholar Applications
          </Link>
        </li>
        <li>
          <Link to="#">
            <i className="fas fa-check-circle"></i> Verified Scholars
          </Link>
        </li>
        <li>
          <Link to="#">
            <i className="fas fa-question-circle"></i> Content Management
          </Link>
        </li>
        <li>
          <Link to="#">
            <i className="fas fa-chart-line"></i> Analytics
          </Link>
        </li>
        <li>
          <Link to="#">
            <i className="fas fa-cog"></i> Settings
          </Link>
        </li>
        <li>
          <Link to="#">
            <i className="fas fa-sign-out-alt"></i> Logout
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
