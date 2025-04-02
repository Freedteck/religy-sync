import { Outlet } from "react-router-dom";
import Header from "../../components/header/Header";
import styles from "./Root.module.css";
const Root = () => {
  return (
    <div className={styles.root}>
      <Header />
      <Outlet />
    </div>
  );
};

export default Root;
