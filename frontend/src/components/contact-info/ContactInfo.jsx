import styles from "./ContactInfo.module.css";
const ContactInfo = ({ contactItems }) => {
  return (
    <div className={styles["contact-info"]}>
      <h2 className={styles["section-title"]}>Contact Information</h2>
      <ul className={styles["contact-list"]}>
        {contactItems.map((item, index) => (
          <li key={index} className={styles["contact-item"]}>
            <div className={styles["contact-icon"]}>{item.icon}</div>
            <div className={styles["contact-text"]}>{item.text}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactInfo;
