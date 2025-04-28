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
import Loading from "../../components/loading/Loading";
import ErrorState from "../../components/error/ErrorState";
import EmptyState from "../../components/empty/EmptyState";

const Home = () => {
  const [scholars, setScholars] = useState([]);
  const [featuredContents, setFeaturedContents] = useState([]);
  const [questions, setQuestions] = useState([]);
  const suiClient = useSuiClient();

  const { religySyncPackageId, platformId } = useNetworkVariables(
    "religySyncPackageId",
    "platformId",
    "adminCapId"
  );

  // Scholar applications
  const {
    applications,
    loading: applicationsLoading,
    error: applicationsError,
  } = useScholarApplications(suiClient, religySyncPackageId, platformId);

  // All content events
  const {
    data: contentEvents,
    isFetching: contentLoading,
    isError: contentError,
  } = useSuiClientInfiniteQuery(
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

  const { contentList: allContent } = useContentFromEvents(contentEvents);

  // Filter insights & questions
  useEffect(() => {
    if (!allContent || allContent.length === 0) return;

    const insights = allContent
      .filter((c) => c.data.content.fields.content_type === 2)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 4);

    const recentQuestions = allContent
      .filter((c) => c.data.content.fields.content_type === 0)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 4);

    setFeaturedContents(insights);
    setQuestions(recentQuestions);
  }, [allContent]);

  useEffect(() => {
    if (applications) {
      setScholars(applications.filter((app) => app.status === "approved"));
    }
  }, [applications]);

  const isLoading = contentLoading || applicationsLoading;
  const isError = contentError || applicationsError;
  const isEmpty =
    !isLoading && !isError && (!allContent?.length || allContent.length === 0);

  const religions = [
    { id: 1, name: "Christianity", followers: "2.4B", icon: "✝️" },
    { id: 2, name: "Islam", followers: "1.9B", icon: "☪️" },
    { id: 3, name: "Hinduism", followers: "1.2B", icon: "🕉️" },
    { id: 4, name: "Buddhism", followers: "506M", icon: "☸️" },
    { id: 5, name: "Judaism", followers: "14M", icon: "✡️" },
  ];

  return (
    <main className={styles.home}>
      <Banner />

      {isLoading && <Loading message="Loading platform content..." />}
      {isError && <ErrorState />}
      {isEmpty && (
        <EmptyState message="No content found yet. Please check back later!" />
      )}

      {!isLoading && !isError && !isEmpty && (
        <>
          {/* Religions Section */}
          <section className={styles.section}>
            <h2>Explore Religions</h2>
            <div className={styles.religionsGrid}>
              {religions.map((religion) => (
                <ReligionCard key={religion.id} religion={religion} />
              ))}
            </div>
          </section>

          {/* Featured Questions */}
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

          {/* Featured Insights */}
          <section className={styles.section}>
            <h2>Featured Insights</h2>
            {featuredContents.length > 0 ? (
              <ul className={styles.row}>
                {featuredContents.map((content) => (
                  <TeachingCard
                    key={content.data.objectId}
                    teaching={content}
                  />
                ))}
              </ul>
            ) : (
              <p className={styles.emptyState}>
                No insights yet. Check back later!
              </p>
            )}
          </section>

          {/* Featured Scholars */}
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

          {/* Stats */}
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
              <div className={styles["stat-number"]}>
                {allContent.filter(
                  (content) => content.data.content.fields.content_type === 3
                ).length || "0"}
              </div>
              <div className={styles["stat-description"]}>Prayers Posted</div>
            </div>
            <div className={styles["stat-box"]}>
              <div className={styles["stat-number"]}>{scholars.length}</div>
              <div className={styles["stat-description"]}>
                Verified Scholars
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default Home;
