import { Outlet } from "react-router-dom";
import Header from "../../components/header/Header";
import styles from "./Root.module.css";
import Footer from "../../components/footer/Footer";
import { Toaster } from "react-hot-toast";

const Root = () => {
  return (
    <div className={styles.root}>
      <Toaster position="bottom-center" />
      <Header />
      <div className="container">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Root;
