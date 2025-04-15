import { Outlet, Link } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import styles from "./Admin.module.css";
import { ConnectButton } from "@mysten/dapp-kit";

const Admin = () => {
  return (
    <div className={styles.adminWrapper}>
      <Sidebar />
      <div className={styles.adminContainer}>
        <div className={styles.mainHeader}>
          <h1 className={styles.pageTitle}>Admin Dashboard</h1>
          <div className={styles.headerControls}>
            <ConnectButton />
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
