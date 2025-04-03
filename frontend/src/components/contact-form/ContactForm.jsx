import Button from "../button/Button";
import styles from "./ContactForm.module.css";
const ContactForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here
  };

  return (
    <div className={styles["contact-form"]}>
      <h2 className={styles["section-title"]}>Send Us a Message</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles["form-group"]}>
          <label htmlFor="name" className={styles["form-label"]}>
            Your Name
          </label>
          <input
            type="text"
            id="name"
            className={styles["form-input"]}
            placeholder="Enter your name"
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="email" className={styles["form-label"]}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className={styles["form-input"]}
            placeholder="Enter your email"
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="subject" className={styles["form-label"]}>
            Subject
          </label>
          <input
            type="text"
            id="subject"
            className={styles["form-input"]}
            placeholder="What is this about?"
          />
        </div>
        <div className={styles["form-group"]}>
          <label htmlFor="message" className={styles["form-label"]}>
            Message
          </label>
          <textarea
            id="message"
            className={styles["form-textarea"]}
            placeholder="Your message..."
          ></textarea>
        </div>
        <Button text={"Send Message"} btnClass="primary" />
      </form>
    </div>
  );
};

export default ContactForm;
