import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.links}>
          <Link to="#">About</Link>
          <Link to="#">Help Center</Link>
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Terms of Service</Link>
        </div>
        <div className={styles.copyright}>© 2025 ReligySync - Built on Sui Blockchain</div>
      </div>
    </footer>
  );
};

export default Footer;
