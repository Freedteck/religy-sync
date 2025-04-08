import { useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import Pagination from "../../components/pagination/Pagination";
import QuestionList from "../../components/question-list/QuestionList";
import styles from "./Questions.module.css";
import { useSuiClientInfiniteQuery } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../../config/networkConfig";
import { useEffect, useState } from "react";
import useContentFromEvents from "../../hooks/useContentFromEvent";
import { filterAndSortContent } from "../../utils/helpers";

const Questions = () => {
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const navigate = useNavigate();

  // Filter states
  const [faithTradition, setFaithTradition] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [activeTag, setActiveTag] = useState(""); // Initial tags

  const religySyncPackageId = useNetworkVariable("religySyncPackageId");
  const {
    data: eventsData,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useSuiClientInfiniteQuery(
    "queryEvents",
    {
      query: {
        MoveEventType: `${religySyncPackageId}::religy_sync::ContentCreated`,
      },
      limit: 8,
      cursor: null,
    },
    {
      enabled: true,
      select: (data) =>
        data.pages
          .flatMap((page) => page.data)
          .filter((x) => x.parsedJson.content_type === 0),
    }
  );

  const { contentList: questionList, isPending } =
    useContentFromEvents(eventsData);

  useEffect(() => {
    if (!questionList || questionList.length === 0) return;

    // Use helper function to filter and sort content
    const filtered = filterAndSortContent(
      questionList,
      {
        faithTradition,
        tags: activeTag ? [activeTag] : [],
        status,
      },
      sortBy
    );

    setFilteredQuestions(filtered);
    console.log("Filtered Questions:", filtered);
  }, [questionList, faithTradition, status, sortBy, activeTag]);

  // Handle filter changes
  const handleFaithTraditionChange = (e) => {
    setFaithTradition(e.target.value);
    addTag(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Remove a tag from active filters
  const removeTag = () => {
    setActiveTag("");
    setFaithTradition("");
  };

  // Add a new tag to filters (could be used for a future "Add Tag" feature)
  const addTag = (newTag) => {
    if (newTag === "") {
      setActiveTag("");
    } else if (activeTag !== newTag) {
      setActiveTag(newTag);
    }
  };

  const askQuestion = () => {
    navigate("/ask-question");
  };

  return (
    <main className={styles.questions}>
      <section className={styles["top-header"]}>
        <h1>Questions & Answers</h1>
        <Button text={"Ask a Question"} onClick={askQuestion} />
      </section>
      <section className={styles.filters}>
        <h3 className={styles.title}>Filter Questions</h3>
        <div className={styles.options}>
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
            Status
            <select
              className={styles.select}
              value={status}
              onChange={handleStatusChange}
            >
              <option value="">All Questions</option>
              <option value="answered">Answered</option>
              <option value="pending">Awaiting Answer</option>
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
              <option value="most_votes">Most Votes</option>
              <option value="most_answers">Most Answers</option>
            </select>
          </label>
        </div>

        {activeTag && (
          <div className={styles.tags}>
            <div className={styles.tag}>
              {activeTag}
              <span className={styles.remove} onClick={removeTag}>
                ×
              </span>
            </div>
          </div>
        )}
      </section>

      {isPending ? (
        <div className={styles.loading}>
          <h2>Loading...</h2>
        </div>
      ) : filteredQuestions.length > 0 ? (
        <QuestionList questionList={filteredQuestions} />
      ) : (
        <div className={styles.noResults}>
          <h2>No questions match your filters</h2>
          <p>
            Try adjusting your filter criteria or{" "}
            <span
              className={styles.clearFilters}
              onClick={() => {
                setFaithTradition("");
                setStatus("");
                setSortBy("newest");
                setActiveTag("");
              }}
            >
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
    </main>
  );
};

export default Questions;
