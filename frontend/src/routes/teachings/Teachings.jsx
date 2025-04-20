import { useEffect, useState } from "react";
import styles from "./Teachings.module.css";
import TeachingCard from "../../components/teaching-card/TeachingCard";
import Button from "../../components/button/Button";
import { useNavigate } from "react-router-dom";
import { useNetworkVariable } from "../../config/networkConfig";
import { useSuiClientInfiniteQuery } from "@mysten/dapp-kit";
import useContentFromEvents from "../../hooks/useContentFromEvent";

const Teachings = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();
  const religySyncPackageId = useNetworkVariable("religySyncPackageId");

  const {
    data: eventsData,
    // isFetching,
    // fetchNextPage,
    // hasNextPage,
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
      select: (data) =>
        data.pages
          .flatMap((page) => page.data)
          .filter((x) => x.parsedJson.content_type === 2),
    }
  );

  const { contentList: questionList, isPending } =
    useContentFromEvents(eventsData);

  useEffect(() => {
    if (!questionList || questionList.length === 0) return;

    // Use helper function to filter and sort content
    console.log("questionList", questionList);
  }, [questionList]);

  return (
    <main className={styles.container}>
      <section className={styles.header}>
        <div className={styles.headerTitle}>
          <h1>Insights & Teachings</h1>
          <p>Explore wisdom and knowledge from verified religious scholars</p>
        </div>
        <Button
          text={"Create Insight"}
          onClick={() => navigate("/create-insight")}
        />
      </section>

      <section className={styles.featuredSection}>
        <h2 className={styles.sectionHeading}>Featured</h2>
        {!isPending && <TeachingCard teaching={questionList[0]} featured />}
      </section>

      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <button
            className={`${styles.filterBtn} ${
              activeFilter === "all" ? styles.active : ""
            }`}
            onClick={() => setActiveFilter("all")}
          >
            All
          </button>
          <button
            className={`${styles.filterBtn} ${
              activeFilter === "articles" ? styles.active : ""
            }`}
            onClick={() => setActiveFilter("articles")}
          >
            Articles
          </button>
          <button
            className={`${styles.filterBtn} ${
              activeFilter === "videos" ? styles.active : ""
            }`}
            onClick={() => setActiveFilter("videos")}
          >
            Videos
          </button>
        </div>
        <div className={styles.filterGroup}>
          <button className={styles.filterBtn}>Latest</button>
          <button className={styles.filterBtn}>Popular</button>
        </div>
        <div className={styles.searchBar}>
          <input type="text" placeholder="Search insights..." />
          <div className={styles.searchIcon}>🔍</div>
        </div>
      </div>

      {!isPending && (
        <section className={styles.insightsGrid}>
          {questionList.map((teaching) => (
            <TeachingCard key={teaching?.data.objectId} teaching={teaching} />
          ))}
        </section>
      )}

      <div className={styles.pagination}>
        <a href="#" className={`${styles.pageBtn} ${styles.active}`}>
          1
        </a>
        <a href="#" className={styles.pageBtn}>
          2
        </a>
        <a href="#" className={styles.pageBtn}>
          3
        </a>
        <a href="#" className={styles.pageBtn}>
          ▶
        </a>
      </div>
    </main>
  );
};

export default Teachings;
