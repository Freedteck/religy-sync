import { useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import QuestionList from "../../components/question-list/QuestionList";
import styles from "./Questions.module.css";
import { useNetworkVariable } from "../../config/networkConfig";
import { useEffect, useState } from "react";
import useContentFromEvents from "../../hooks/useContentFromEvent";
import { filterAndSortContent } from "../../utils/helpers";
import Loading from "../../components/loading/Loading";
import EmptyState from "../../components/empty/EmptyState";
import ErrorState from "../../components/error/ErrorState";
import { useQueryEvents } from "../../hooks/useQueryEvents";
import { FaTimes, FaFilter, FaQuestionCircle } from "react-icons/fa";

const Questions = () => {
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const navigate = useNavigate();

  // Filter states
  const [faithTradition, setFaithTradition] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [activeTag, setActiveTag] = useState("");

  const religySyncPackageId = useNetworkVariable("religySyncPackageId");
  const {
    data: questinsEventsData,
    isFetching,
    isError,
    hasNextPage,
    fetchNextPage,
  } = useQueryEvents({
    packageId: religySyncPackageId,
    eventType: "ContentCreated",
    filters: {
      contentType: 0, // 0 = question
    },
  });

  const { contentList: questionList } =
    useContentFromEvents(questinsEventsData);

  useEffect(() => {
    if (!questionList || questionList.length === 0) return;

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

  const removeTag = () => {
    setActiveTag("");
    setFaithTradition("");
  };

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

  const initialLoading = isFetching && !questionList?.length;
  const showErrorState = isError;
  const showEmptyState = !isError && !questionList?.length && !isFetching;
  const noResultsAfterFiltering =
    filteredQuestions.length === 0 && questionList?.length > 0;

  return (
    <main className={styles.questions}>
      <section className={styles.topHeader}>
        <h1>Divine Dialogue</h1>
        <Button
          text={"Ask a Question"}
          onClick={askQuestion}
          icon={<FaQuestionCircle />}
        />
      </section>

      <section className={styles.filters}>
        <h3 className={styles.title}>
          <FaFilter /> Filter Questions
        </h3>
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
                <FaTimes />
              </span>
            </div>
          </div>
        )}
      </section>

      <section className={styles.contentArea}>
        {initialLoading && <Loading message="Loading questions..." />}
        {showErrorState && <ErrorState />}
        {showEmptyState && <EmptyState />}
        {!initialLoading && !showErrorState && !showEmptyState && (
          <>
            <QuestionList questionList={filteredQuestions} />

            {noResultsAfterFiltering && (
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
          </>
        )}
      </section>
    </main>
  );
};

export default Questions;
