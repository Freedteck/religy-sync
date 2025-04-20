import { useEffect, useState } from "react";
import Banner from "../../components/banner/Banner";
import FeaturedCard from "../../components/featured-card/FeaturedCard";
import ProfileCard from "../../components/profile-card/ProfileCard";
import { useNetworkVariables } from "../../config/networkConfig";
import styles from "./Home.module.css";
import useScholarApplications from "../../hooks/useScholarApplications";
import { useSuiClient, useSuiClientInfiniteQuery } from "@mysten/dapp-kit";
import useContentFromEvents from "../../hooks/useContentFromEvent";
import ReligionCard from "../../components/religion-card/ReligionCard";
import TeachingCard from "../../components/teaching-card/TeachingCard";

const Home = () => {
  const [scholars, setScholars] = useState([]);
  const [featuredContents, setFeaturedContents] = useState([]);
  const suiClient = useSuiClient();
  const { religySyncPackageId, platformId } = useNetworkVariables(
    "religySyncPackageId",
    "platformId",
    "adminCapId"
  );

  // Fetch scholar applications
  const {
    applications,
    loading: applicationsLoading,
    error: applicationsError,
  } = useScholarApplications(suiClient, religySyncPackageId, platformId);

  // Fetch all content events
  const { data: contentEvents } = useSuiClientInfiniteQuery(
    "queryEvents",
    {
      query: {
        MoveEventType: `${religySyncPackageId}::religy_sync::ContentCreated`,
      },
      cursor: null,
    },
    {
      enabled: true,
      select: (data) => data.pages.flatMap((page) => page.data),
    }
  );

  // Process all content
  const { contentList: allContent } = useContentFromEvents(contentEvents);

  // Filter and sort content by type
  useEffect(() => {
    if (!allContent || allContent.length === 0) return;

    // Get featured content (type 2 - insights)
    const insights = allContent
      .filter((content) => content.data.content.fields.content_type === 2)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 4); // Get 4 most recent
    console.log("insights", insights);

    // Get questions (type 0)
    const questions = allContent
      .filter((content) => content.data.content.fields.content_type === 0)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 4); // Get 4 most recent

    setFeaturedContents(insights);
    setQuestions(questions);
  }, [allContent]);

  const [questions, setQuestions] = useState([]);

  const religions = [
    { id: 1, name: "Christianity", followers: "2.4B", icon: "✝️" },
    { id: 2, name: "Islam", followers: "1.9B", icon: "☪️" },
    { id: 3, name: "Hinduism", followers: "1.2B", icon: "🕉️" },
    { id: 4, name: "Buddhism", followers: "506M", icon: "☸️" },
    { id: 5, name: "Judaism", followers: "14M", icon: "✡️" },
  ];

  useEffect(() => {
    if (applications) {
      setScholars(applications?.filter((app) => app.status === "approved"));
    }
  }, [applicationsLoading, applicationsError, applications]);

  return (
    <main className={styles.home}>
      <Banner />

      {/* Religions Section */}
      <section className={styles.section}>
        <h2>Explore Religions</h2>
        <div className={styles.religionsGrid}>
          {religions.map((religion) => (
            <ReligionCard key={religion.id} religion={religion} />
          ))}
        </div>
      </section>

      {/* Featured Questions Section */}
      <section className={styles.section}>
        <h2>Featured Questions</h2>
        {questions.length > 0 ? (
          <ul className={styles.row}>
            {questions.map((question, index) => (
              <FeaturedCard key={index} data={question} />
            ))}
          </ul>
        ) : (
          <p className={styles.emptyState}>
            No questions yet. Be the first to ask!
          </p>
        )}
      </section>

      {/* Featured Insights Section */}
      <section className={styles.section}>
        <h2>Featured Insights</h2>
        {featuredContents.length > 0 ? (
          <ul className={styles.row}>
            {featuredContents?.map((content) => (
              <TeachingCard key={content?.data.objectId} teaching={content} />
            ))}
          </ul>
        ) : (
          <p className={styles.emptyState}>
            No insights yet. Check back later!
          </p>
        )}
      </section>

      {/* Featured Scholars Section */}
      <section className={styles.section}>
        <h2>Featured Scholars</h2>
        {scholars.length > 0 ? (
          <ul className={`${styles.row} ${styles.scholars}`}>
            {scholars.slice(0, 6).map((scholar, index) => (
              <ProfileCard key={index} data={scholar} />
            ))}
          </ul>
        ) : (
          <p className={styles.emptyState}>
            No scholars available at the moment.
          </p>
        )}
      </section>

      {/* Platform Stats */}
      <section className={styles["platform-stats"]}>
        <div className={styles["stat-box"]}>
          <div className={styles["stat-number"]}>
            {allContent.filter(
              (content) => content.data.content.fields.content_type === 0
            ).length || "0"}
          </div>
          <div className={styles["stat-description"]}>Questions Asked</div>
        </div>
        <div className={styles["stat-box"]}>
          <div className={styles["stat-number"]}>
            {allContent.filter(
              (content) => content.data.content.fields.content_type === 1
            ).length || "0"}
          </div>
          <div className={styles["stat-description"]}>Answers Provided</div>
        </div>
        <div className={styles["stat-box"]}>
          <div className={styles["stat-number"]}>{scholars.length}</div>
          <div className={styles["stat-description"]}>Verified Scholars</div>
        </div>
        {/* <div className={styles["stat-box"]}>
          <div className={styles["stat-number"]}>175,896</div>
          <div className={styles["stat-description"]}>SUI Rewards Given</div>
        </div> */}
      </section>
    </main>
  );
};

export default Home;
