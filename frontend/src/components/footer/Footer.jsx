import { Link } from "react-router-dom";
import {
  FaInfoCircle,
  FaQuestionCircle,
  FaLock,
  FaFileAlt,
  FaGithub,
  FaTwitter,
  FaDiscord,
} from "react-icons/fa";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.linksSection}>
          <div className={styles.linksGroup}>
            <h4 className={styles.linksHeading}>Resources</h4>
            <div className={styles.links}>
              <Link to="/about" className={styles.link}>
                <FaInfoCircle className={styles.linkIcon} />
                About
              </Link>
              <Link to="/help" className={styles.link}>
                <FaQuestionCircle className={styles.linkIcon} />
                Help Center
              </Link>
            </div>
          </div>

          <div className={styles.linksGroup}>
            <h4 className={styles.linksHeading}>Legal</h4>
            <div className={styles.links}>
              <Link to="/privacy" className={styles.link}>
                <FaLock className={styles.linkIcon} />
                Privacy Policy
              </Link>
              <Link to="/terms" className={styles.link}>
                <FaFileAlt className={styles.linkIcon} />
                Terms of Service
              </Link>
            </div>
          </div>

          <div className={styles.linksGroup}>
            <h4 className={styles.linksHeading}>Community</h4>
            <div className={styles.socialLinks}>
              <a
                href="https://github.com/religysync"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <FaGithub className={styles.socialIcon} />
              </a>
              <a
                href="https://twitter.com/religysync"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <FaTwitter className={styles.socialIcon} />
              </a>
              <a
                href="https://discord.gg/religysync"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <FaDiscord className={styles.socialIcon} />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.copyright}>
          © {new Date().getFullYear()} ReligySync - Built on Sui Blockchain
        </div>
      </div>
    </footer>
  );
};

export default Footer;
