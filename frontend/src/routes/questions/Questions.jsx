import { useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import Pagination from "../../components/pagination/Pagination";
import QuestionList from "../../components/question-list/QuestionList";
import styles from "./Questions.module.css";
import { useSuiClientInfiniteQuery, useSuiClientQuery } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../../config/networkConfig";
import { useEffect, useState } from "react";

const Questions = () => {
  const [objectIds, setObjectIds] = useState([]);
  const [timestampMs, setTimeStampMs] = useState([]);
  const [questionList, setQuestionList] = useState([]);
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
    isFetchingNextPage,
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

  const { data: questionListData, isPending } = useSuiClientQuery(
    "multiGetObjects",
    {
      ids: objectIds,
      options: {
        showType: true,
        showOwner: true,
        showPreviousTransaction: false,
        showDisplay: false,
        showContent: true,
        showBcs: false,
        showStorageRebate: false,
      },
      cursor: null,
    },
    {
      enabled: objectIds.length > 0,
    }
  );

  useEffect(() => {
    if (isFetchingNextPage) {
      console.log("Loading...");
    } else if (eventsData) {
      const ids = eventsData.flatMap((event) => event.parsedJson.content_id);
      const timestampMs = eventsData.flatMap((event) => event.timestampMs);
      setObjectIds(ids);
      setTimeStampMs(timestampMs);
    }
  }, [eventsData, isFetchingNextPage]);

  useEffect(() => {
    if (questionListData) {
      const questionListWithTimestamp = questionListData.map(
        (question, index) => {
          return {
            ...question,
            timestampMs: timestampMs[index],
          };
        }
      );
      setQuestionList(questionListWithTimestamp);
      console.log("Question List Data:", questionListWithTimestamp);
    }
  }, [questionListData, timestampMs]);

  // Apply filters and sorting whenever relevant state changes
  useEffect(() => {
    if (!questionList) return;

    let filtered = [...questionList];

    // Apply faith tradition filter
    if (faithTradition) {
      filtered = filtered.filter((question) => {
        const tradition = JSON.parse(
          question.data?.content?.fields?.metadata
        ).tradition;
        return (
          tradition && tradition.toLowerCase() === faithTradition.toLowerCase()
        );
      });
    }

    // Apply tag filters
    if (activeTag) {
      filtered = filtered.filter((question) => {
        const questionTags =
          JSON.parse(question.data?.content?.fields?.metadata).tags || [];
        return questionTags.some(
          (qTag) => qTag.toLowerCase() === activeTag.toLowerCase()
        );
      });
    }

    // Apply status filter
    if (status) {
      filtered = filtered.filter((question) => {
        const questionStatus = question.data?.content?.fields?.status;
        if (status === "answered") {
          return questionStatus === "answered";
        } else if (status === "pending") {
          return questionStatus === "pending" || !questionStatus;
        }
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.timestampMs - a.timestampMs;
        case "oldest":
          return a.timestampMs - b.timestampMs;
        case "most_votes": {
          const votesA = a.data?.content?.fields?.votes || 0;
          const votesB = b.data?.content?.fields?.votes || 0;
          return votesB - votesA;
        }
        case "most_answers": {
          const answersA = a.data?.content?.fields?.answer_count || 0;
          const answersB = b.data?.content?.fields?.answer_count || 0;
          return answersB - answersA;
        }
        default:
          return 0;
      }
    });

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

      {hasNextPage && !isFetchingNextPage && (
        <button
          className={styles.loadMore}
          onClick={fetchNextPage}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          Load more...
        </button>
      )}
    </main>
  );
};

export default Questions;
