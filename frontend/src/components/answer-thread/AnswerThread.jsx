import { useEffect, useState } from "react";
import Answers from "../../components/answers/Answers";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Question from "../../components/question/Question";
import RelatedQuestions from "../../components/related-questions/RelatedQuestions";
import YourAnswer from "../../components/your-answer/YourAnswer";
import styles from "./QuestionDetails.module.css";
import { useParams } from "react-router-dom";
import {
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientInfiniteQuery,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { useNetworkVariables } from "../../config/networkConfig";
import useCreateContent from "../../hooks/useCreateContent";

const QuestionDetails = () => {
  const { id } = useParams();
  const [objectIds, setObjectIds] = useState([id]);
  const [timestampMs, setTimeStampMs] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [sortOrder, setSortOrder] = useState("votes");
  const { religySyncPackageId, platformId } = useNetworkVariables(
    "religySyncPackageId",
    "platformId",
    "adminCapId"
  );
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const { likeContent, sendReward } = useCreateContent(
    religySyncPackageId,
    platformId,
    suiClient,
    signAndExecute
  );

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
          .filter(
            (x) =>
              x.parsedJson.content_type === 1 && x.parsedJson.related_to === id
          ),
    }
  );

  const { data: answerListData, refetch: refreshAnswers } = useSuiClientQuery(
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

  const {
    data: question,
    isPending,
    refetch: refreshQuestion,
  } = useSuiClientQuery(
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

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleLike = (contentId, contentType) => {
    if (contentType === "question") {
      likeContent(contentId, refreshQuestion);
    } else if (contentType === "answer") {
      likeContent(contentId, refreshAnswers);
    }
  };

  return (
    <main className={styles["question-details"]}>
      <Breadcrumb />
      {!isPending ? (
        <Question
          question={question?.fields}
          likeQuestion={() => handleLike(id, "question")}
        />
      ) : (
        <div className={styles["loading"]}>Loading...</div>
      )}
      <Answers
        answers={answers}
        sortOrder={sortOrder}
        handleSortChange={handleSortChange}
        religySyncPackageId={religySyncPackageId}
        platformId={platformId}
        suiClient={suiClient}
        signAndExecute={signAndExecute}
        likeAnswer={handleLike}
        sendReward={sendReward}
      />
      <YourAnswer
        religySyncPackageId={religySyncPackageId}
        platformId={platformId}
        suiClient={suiClient}
        signAndExecute={signAndExecute}
        questionId={id}
        refetchAnswers={refreshAnswers}
      />
      <RelatedQuestions relatedQuestions={relatedQuestions} />
    </main>
  );
};

export default QuestionDetails;
