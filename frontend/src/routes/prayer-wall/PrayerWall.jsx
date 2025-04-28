import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PrayerWall.module.css";
import PrayerNote from "../../components/prayer-note/PrayerNote";
import Button from "../../components/button/Button";
import Loading from "../../components/loading/Loading";
import EmptyState from "../../components/empty/EmptyState";
import ErrorState from "../../components/error/ErrorState";
import { useNetworkVariables } from "../../config/networkConfig";
import {
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientInfiniteQuery,
} from "@mysten/dapp-kit";
import useContentFromEvents from "../../hooks/useContentFromEvent";
import { filterAndSortContent } from "../../utils/helpers";
import useCreateContent from "../../hooks/useCreateContent";
import TipModal from "../../modals/tip-modal/TipModal";

const PrayerWall = () => {
  const navigate = useNavigate();

  // Filter states
  const [faithTradition, setFaithTradition] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPrayers, setFilteredPrayers] = useState([]);
  const [openTipModal, setOpenTipModal] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [isRewardSent, setIsRewardSent] = useState(false);

  const { religySyncPackageId, platformId } = useNetworkVariables(
    "religySyncPackageId",
    "platformId",
    "adminCapId"
  );
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

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
    },
    {
      enabled: true,
      select: (data) =>
        data.pages
          .flatMap((page) => page.data)
          .filter((x) => x.parsedJson.content_type === 3), // 3 = prayer
    }
  );

  const { contentList: prayers, refetch: refetchPrayers } =
    useContentFromEvents(eventsData);

  const { likeContent, sendReward } = useCreateContent(
    religySyncPackageId,
    platformId,
    suiClient,
    signAndExecute
  );

  useEffect(() => {
    if (!prayers || prayers.length === 0) return;

    const filtered = filterAndSortContent(
      prayers,
      {
        faithTradition,
        tags: activeTag ? [activeTag] : [],
        searchQuery,
      },
      sortBy
    );

    setFilteredPrayers(filtered);
  }, [prayers, faithTradition, searchQuery, sortBy, activeTag]);

  // Handle filter changes
  const handleFaithTraditionChange = (e) => {
    setFaithTradition(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const createPrayer = () => {
    navigate("/create-prayer");
  };

  const clearFilters = () => {
    setFaithTradition("");
    setActiveTag("");
    setSortBy("newest");
    setSearchQuery("");
  };

  const openTipModalHandler = (id) => {
    setOpenTipModal(true);
    setSelectedPrayer(id);
  };

  const closeTipModalHandler = () => {
    setOpenTipModal(false);
  };

  const handleSendReward = (objectId, amount) => {
    setIsRewardSent(false); // Reset before sending new reward
    sendReward(objectId, amount, () => {
      setIsRewardSent(true);

      setTimeout(() => {
        setIsRewardSent(false);
      }, 1000);
    });
  };

  const initialLoading = isFetching && !prayers?.length;
  const showErrorState = isError;
  const showEmptyState = !isError && !prayers?.length && !isFetching;
  const noResultsAfterFiltering =
    filteredPrayers.length === 0 && prayers?.length > 0;

  return (
    <main className={styles.container}>
      <section className={styles.header}>
        <div className={styles.headerTitle}>
          <h1>Prayer Wall</h1>
          <p>
            Share your prayers and intercessions with the community. Each prayer
            is like a note pinned to this virtual wall.
          </p>
        </div>
        <Button text={"Create Prayer"} onClick={createPrayer} />
      </section>

      <section className={styles.filters}>
        <div className={styles.filterOptions}>
          <div className={styles.filterGroup}>
            <label>
              Faith Tradition
              <select
                className={styles.select}
                value={faithTradition}
                onChange={handleFaithTraditionChange}
              >
                <option value="">All Traditions</option>
                <option value="buddhism">Buddhism</option>
                <option value="christianity">Christianity</option>
                <option value="hinduism">Hinduism</option>
                <option value="islam">Islam</option>
                <option value="judaism">Judaism</option>
                <option value="sikhism">Sikhism</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label>
              Sort By
              <select
                className={styles.select}
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most_prayers">Most Prayers</option>
              </select>
            </label>
          </div>

          {(faithTradition || activeTag) && (
            <div className={styles.activeFilters}>
              {faithTradition && (
                <div className={styles.filterTag}>
                  {faithTradition}
                  <span
                    className={styles.removeFilter}
                    onClick={() => setFaithTradition("")}
                  >
                    ×
                  </span>
                </div>
              )}
              {activeTag && (
                <div className={styles.filterTag}>
                  {activeTag}
                  <span
                    className={styles.removeFilter}
                    onClick={() => setActiveTag("")}
                  >
                    ×
                  </span>
                </div>
              )}
              <button className={styles.clearAll} onClick={clearFilters}>
                Clear all
              </button>
            </div>
          )}
        </div>
        <div className={styles.searchBar}>
          <input
            type="sear"
            placeholder="Search prayers..."
            value={searchQuery}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>
      </section>

      <section className={styles.contentArea}>
        {initialLoading && <Loading message="Loading prayers..." />}
        {showErrorState && <ErrorState />}
        {showEmptyState && <EmptyState />}

        {!initialLoading && !showErrorState && !showEmptyState && (
          <>
            <div className={styles.grid}>
              {filteredPrayers.map((prayer, index) => (
                <PrayerNote
                  key={prayer.data.obJectId}
                  data={prayer}
                  rotationClass={`rotate${index + 1}`}
                  onLike={() =>
                    likeContent(prayer.data.objectId, refetchPrayers)
                  }
                  onTip={() => openTipModalHandler(prayer.data.objectId)}
                />
              ))}
            </div>

            {noResultsAfterFiltering && (
              <div className={styles.noResults}>
                <h2>No prayers match your filters</h2>
                <p>
                  Try adjusting your filter criteria or{" "}
                  <span className={styles.clearFilters} onClick={clearFilters}>
                    clear all filters
                  </span>
                </p>
              </div>
            )}

            {hasNextPage && !isFetching && (
              <button
                className={styles.loadMore}
                onClick={fetchNextPage}
                disabled={!hasNextPage || isFetching}
              >
                Load more...
              </button>
            )}
          </>
        )}
      </section>

      <TipModal
        isOpen={openTipModal}
        onClose={closeTipModalHandler}
        answerId={selectedPrayer}
        sendReward={handleSendReward}
        isRewardSent={isRewardSent}
      />
    </main>
  );
};

export default PrayerWall;
