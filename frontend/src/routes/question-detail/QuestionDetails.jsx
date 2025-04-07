import { useEffect, useState } from "react";
import Answers from "../../components/answers/Answers";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Question from "../../components/question/Question";
import RelatedQuestions from "../../components/related-questions/RelatedQuestions";
import YourAnswer from "../../components/your-answer/YourAnswer";
import styles from "./QuestionDetails.module.css";
import { useParams } from "react-router-dom";
import { useSuiClientInfiniteQuery, useSuiClientQuery } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../../config/networkConfig";

const QuestionDetails = () => {
  const { id } = useParams();
  const [objectIds, setObjectIds] = useState([id]);
  const [timestampMs, setTimeStampMs] = useState([]);
  const [answers, setAnswers] = useState([]);
  const religySyncPackageId = useNetworkVariable("religySyncPackageId");
  const {
    data: eventsData,
    // isFetchingNextPage,
    // fetchNextPage,
    // hasNextPage,
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
          .filter((x) => x.parsedJson.content_type === 1),
    }
  );

  const { data: answerListData } = useSuiClientQuery(
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
      // enabled: objectIds.length > 0,
    }
  );

  const { data: question } = useSuiClientQuery(
    "getObject",
    {
      id: id,
      options: {
        showContent: true,
        showDisplay: true,
        showOwner: true,
        showPreviousTransaction: false,
        showType: true,
        showBcs: true,
        showStorageRebate: true,
      },
    },
    {
      select: (data) => data.data?.content,
    }
  );

  useEffect(() => {
    console.log("Answers", eventsData);
    if (eventsData) {
      const ids = eventsData.flatMap((event) => event.parsedJson.content_id);
      const timestampMs = eventsData.flatMap((event) => event.timestampMs);
      setObjectIds(ids);
      setTimeStampMs(timestampMs);
    }
  }, [id, eventsData]);

  useEffect(() => {
    if (answerListData) {
      const answersList = answerListData?.map((question, index) => {
        return {
          ...question,
          timestampMs: timestampMs[index],
        };
      });
      setAnswers(answersList);
    }
  }, [answerListData, timestampMs]);

  const relatedQuestions = [
    {
      id: "q1",
      title: "What are the key differences between Zen and Tibetan Buddhism?",
      answers: 15,
      views: 476,
    },
    {
      id: "q2",
      title:
        "How does the concept of rebirth differ between Hindu and Buddhist traditions?",
      answers: 8,
      views: 312,
    },
    {
      id: "q3",
      title:
        "What is the significance of the Lotus Sutra in Mahayana Buddhism?",
      answers: 6,
      views: 189,
    },
    {
      id: "q4",
      title: "How do Buddhist traditions approach meditation differently?",
      answers: 12,
      views: 527,
    },
  ];

  const [sortOrder, setSortOrder] = useState("votes");
  const [answerText, setAnswerText] = useState("");

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // const handleAnswerChange = (e) => {
  //   setAnswerText(e.target.value);
  // };

  const handleSubmitAnswer = () => {
    // Logic to submit answer to backend
    console.log("Submitting answer:", answerText);
    setAnswerText("");
  };

  return (
    <main className={styles["question-details"]}>
      <Breadcrumb />
      <Question question={question?.fields} />
      <Answers
        answers={answers}
        sortOrder={sortOrder}
        handleSortChange={handleSortChange}
      />
      <YourAnswer handleSubmitAnswer={handleSubmitAnswer} />
      <RelatedQuestions relatedQuestions={relatedQuestions} />
    </main>
  );
};

export default QuestionDetails;
