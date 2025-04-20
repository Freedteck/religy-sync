import { useNavigate } from "react-router-dom";
import Button from "../button/Button";
import styles from "./Banner.module.css";
const Banner = () => {
  const navigate = useNavigate();
  return (
    <section className={styles.banner}>
      <h1>Discover Authentic Spiritual Wisdom</h1>
      <p>
        Connect with verified religious scholars, explore faith-based knowledge,
        and engage with a community of seekers. All content is stored on the Sui
        blockchain for authenticity and permanence.
      </p>
      <div className={styles.buttons}>
        <Button
          text={"Ask a Question"}
          onClick={() => navigate("ask-question")}
        />
        <Button
          text={"Explore Teachings"}
          btnClass="secondary"
          onClick={() => navigate("teachings")}
        />
      </div>
    </section>
  );
};

export default Banner;
