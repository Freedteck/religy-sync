import { useEffect, useState, useMemo } from "react";
import styles from "./Teachings.module.css";
import TeachingCard from "../../components/teaching-card/TeachingCard";
import Button from "../../components/button/Button";
import { useNavigate } from "react-router-dom";
import { useNetworkVariable } from "../../config/networkConfig";
import { useSuiClientInfiniteQuery } from "@mysten/dapp-kit";
import useContentFromEvents from "../../hooks/useContentFromEvent";
import Loading from "../../components/loading/Loading";
import ErrorState from "../../components/error/ErrorState";
import EmptyState from "../../components/empty/EmptyState";

const Teachings = () => {
  const navigate = useNavigate();
  const religySyncPackageId = useNetworkVariable("religySyncPackageId");

  // State for filters and pagination
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Fetch teachings data
  const {
    data: eventsData,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isError,
  } = useSuiClientInfiniteQuery(
    "queryEvents",
    {
      query: {
        MoveEventType: `${religySyncPackageId}::religy_sync::ContentCreated`,
      },
      cursor: null,
      limit: 50,
    },
    {
      enabled: true,
      select: (data) =>
        data.pages
          .flatMap((page) => page.data)
          .filter((x) => x.parsedJson?.content_type === 2),
    }
  );

  const { contentList: teachings } = useContentFromEvents(eventsData);

  // Process and filter teachings
  const filteredTeachings = useMemo(() => {
    if (!teachings) return [];

    let result = teachings.map((teaching) => {
      try {
        return {
          ...teaching,
          parsedMetadata: JSON.parse(
            teaching.data.content.fields.metadata || "{}"
          ),
        };
      } catch (e) {
        console.error("Error parsing metadata:", e);
        return {
          ...teaching,
          parsedMetadata: {},
        };
      }
    });

    // Apply content type filter
    if (activeFilter !== "all") {
      result = result.filter((teaching) => {
        const type = teaching.parsedMetadata?.type || "";
        return type.toLowerCase() === activeFilter;
      });
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((teaching) => {
        const title = teaching.data.content.fields.title?.toLowerCase() || "";
        const body = teaching.data.content.fields.body?.toLowerCase() || "";
        const description =
          teaching.parsedMetadata?.description?.toLowerCase() || "";
        return (
          title.includes(query) ||
          body.includes(query) ||
          description.includes(query)
        );
      });
    }

    // Apply sorting
    if (sortBy === "latest") {
      result.sort(
        (a, b) => parseInt(b.data.timestampMs) - parseInt(a.data.timestampMs)
      );
    } else if (sortBy === "popular") {
      result.sort(
        (a, b) =>
          parseInt(b.data.content.fields.likes || "0") -
          parseInt(a.data.content.fields.likes || "0")
      );
    }

    return result;
  }, [teachings, activeFilter, searchQuery, sortBy]);

  // Pagination logic
  const paginatedTeachings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTeachings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTeachings, currentPage]);

  const totalPages = Math.ceil(filteredTeachings.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Auto-load more when reaching the end
  useEffect(() => {
    if (!isFetching && hasNextPage && currentPage >= totalPages) {
      fetchNextPage();
    }
  }, [currentPage, totalPages, isFetching, hasNextPage, fetchNextPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery, sortBy]);

  // Get featured teaching (most recent or most popular)
  const featuredTeaching = useMemo(() => {
    if (!filteredTeachings.length) return null;
    return [...filteredTeachings].sort((a, b) =>
      sortBy === "popular"
        ? parseInt(b.data.content.fields.likes || "0") -
          parseInt(a.data.content.fields.likes || "0")
        : parseInt(b.data.timestampMs) - parseInt(a.data.timestampMs)
    )[0];
  }, [filteredTeachings, sortBy]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const showEmptyState = !isError && !teachings?.length && !isFetching;

  const showErrorState = isError;

  const initialLoading = isFetching && !teachings?.length;

  const noResultsAfterFiltering =
    filteredTeachings.length === 0 && teachings?.length > 0;

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

      {!initialLoading &&
        !showErrorState &&
        !showEmptyState &&
        featuredTeaching && (
          <section className={styles.featuredSection}>
            <h2 className={styles.sectionHeading}>Featured</h2>
            <TeachingCard teaching={featuredTeaching} featured />
          </section>
        )}

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
              activeFilter === "article" ? styles.active : ""
            }`}
            onClick={() => setActiveFilter("article")}
          >
            Articles
          </button>
          <button
            className={`${styles.filterBtn} ${
              activeFilter === "video" ? styles.active : ""
            }`}
            onClick={() => setActiveFilter("video")}
          >
            Videos
          </button>
        </div>
        <div className={styles.filterGroup}>
          <div className={styles.selectContainer}>
            <label htmlFor="sort-select" className={styles.selectLabel}>
              Sort by:
            </label>
            <select
              id="sort-select"
              className={styles.select}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search insights..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className={styles.searchIcon}>🔍</div>
        </div>
      </div>

      {/* Content Area - conditionally render different states */}
      <div className={styles.contentArea}>
        {initialLoading && <Loading message="Loading teachings..." />}

        {showErrorState && <ErrorState />}

        {showEmptyState && <EmptyState />}

        {!initialLoading && !showErrorState && !showEmptyState && (
          <>
            <section className={styles.insightsGrid}>
              {paginatedTeachings.map((teaching) => (
                <TeachingCard
                  key={teaching.data.objectId}
                  teaching={teaching}
                />
              ))}
            </section>

            {noResultsAfterFiltering && (
              <EmptyState message="No insights match your filters" />
            )}

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={`${styles.pageBtn} ${styles.navBtn}`}
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  ◀
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      className={`${styles.pageBtn} ${
                        currentPage === pageNum ? styles.active : ""
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && <span className={styles.ellipsis}>...</span>}

                <button
                  className={`${styles.pageBtn} ${styles.navBtn}`}
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  ▶
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Teachings;
