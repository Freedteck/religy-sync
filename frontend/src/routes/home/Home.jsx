import Banner from "../../components/banner/Banner";
import FeaturedCard from "../../components/featured-card/FeaturedCard";
import ProfileCard from "../../components/profile-card/ProfileCard";
import { questions, scholars } from "../../samples/questions";
import styles from "./Home.module.css";
const Home = () => {
  return (
    <main className={styles.home}>
      <Banner />
      <section className={styles.section}>
        <h2>Featured Questions</h2>
        <ul className={styles.row}>
          {questions.map((question, index) => (
            <FeaturedCard key={index} data={question} />
          ))}
        </ul>
      </section>
      <section className={styles.section}>
        <h2>Featured Scholars</h2>
        <ul className={`${styles.row}, ${styles.scholars}`}>
          {scholars.map((scholar, index) => (
            <ProfileCard key={index} data={scholar} />
          ))}
        </ul>
      </section>

      {/* Platform Stats */}
      <section className={styles["platform-stats"]}>
        <div className={styles["stat-box"]}>
          <div className={styles["stat-number"]}>27,453</div>
          <div className={styles["stat-description"]}>Questions Asked</div>
        </div>
        <div className={styles["stat-box"]}>
          <div className={styles["stat-number"]}>18,762</div>
          <div className={styles["stat-description"]}>Answers Provided</div>
        </div>
        <div className={styles["stat-box"]}>
          <div className={styles["stat-number"]}>4,321</div>
          <div className={styles["stat-description"]}>Verified Scholars</div>
        </div>
        <div className={styles["stat-box"]}>
          <div className={styles["stat-number"]}>175,896</div>
          <div className={styles["stat-description"]}>SUI Rewards Given</div>
        </div>
      </section>
    </main>
  );
};

export default Home;
