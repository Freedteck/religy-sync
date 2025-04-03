import { useState } from "react";
import styles from "./FAQItem.module.css";
const FAQItem = ({ question, answer, isActive }) => {
  const [active, setActive] = useState(isActive);

  return (
    <div
      className={`${styles["faq-item"]} ${active ? styles.active : ""}`}
      onClick={() => setActive(!active)}
    >
      <div className={styles["faq-question"]}>{question}</div>
      {active && <div className={styles["faq-answer"]}>{answer}</div>}
    </div>
  );
};

export default FAQItem;
