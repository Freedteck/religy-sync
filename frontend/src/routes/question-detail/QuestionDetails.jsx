import { useEffect, useState } from "react";
import Answers from "../../components/answers/Answers";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import Question from "../../components/question/Question";
import RelatedQuestions from "../../components/related-questions/RelatedQuestions";
import YourAnswer from "../../components/your-answer/YourAnswer";
import styles from "./QuestionDetails.module.css";
import { useParams } from "react-router-dom";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientInfiniteQuery,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { useNetworkVariables } from "../../config/networkConfig";
import useCreateContent from "../../hooks/useCreateContent";
import useScholarStatus from "../../hooks/useScholarStatus";
import Loading from "../../components/loading/Loading";

const QuestionDetails = () => {
  const { id } = useParams();
  const [objectIds, setObjectIds] = useState([id]);
  const [timestampMs, setTimeStampMs] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [followups, setFollowups] = useState({});
  const [clarifications, setClarifications] = useState({});
  const [sortOrder, setSortOrder] = useState("votes");
  const [rewardSent, setRewardSent] = useState(false);

  const { religySyncPackageId, platformId } = useNetworkVariables(
    "religySyncPackageId",
    "platformId",
    "adminCapId"
  );
  const suiClient = useSuiClient();
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const { scholarCapId } = useScholarStatus(
    suiClient,
    religySyncPackageId,
    platformId,
    account
  );

  const { likeContent, sendReward, createFollowup, createClarification } =
    useCreateContent(
      religySyncPackageId,
      platformId,
      suiClient,
      signAndExecute
    );

  // Fetch answers to the question
  const { data: eventsData } = useSuiClientInfiniteQuery(
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
          .filter(
            (x) =>
              x.parsedJson.content_type === 1 && x.parsedJson.related_to === id
          ),
    }
  );

  // Fetch follow-ups (content_type = 4) that relate to answers
  const { data: followupEventsData, refetch: refreshFollowups } =
    useSuiClientInfiniteQuery(
      "queryEvents",
      {
        query: {
          MoveEventType: `${religySyncPackageId}::religy_sync::ContentCreated`,
        },
        cursor: null,
      },
      {
        enabled: answers.length > 0,
        select: (data) =>
          data.pages
            .flatMap((page) => page.data)
            .filter(
              (x) =>
                x.parsedJson.content_type === 4 &&
                answers.some(
                  (answer) => x.parsedJson.related_to === answer.data.objectId
                )
            ),
      }
    );

  // Fetch all follow-up IDs
  const [followupIds, setFollowupIds] = useState([]);

  useEffect(() => {
    if (followupEventsData && followupEventsData.length > 0) {
      const ids = followupEventsData.map(
        (event) => event.parsedJson.content_id
      );
      setFollowupIds(ids);
    }
  }, [followupEventsData]);

  // Fetch clarifications (content_type = 5) that relate to follow-ups
  const { data: clarificationEventsData, refetch: refreshClarifications } =
    useSuiClientInfiniteQuery(
      "queryEvents",
      {
        query: {
          MoveEventType: `${religySyncPackageId}::religy_sync::ContentCreated`,
        },
        cursor: null,
      },
      {
        enabled: followupIds.length > 0,
        select: (data) =>
          data.pages
            .flatMap((page) => page.data)
            .filter(
              (x) =>
                x.parsedJson.content_type === 5 &&
                followupIds.includes(x.parsedJson.related_to)
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

  // Fetch follow-up objects
  const { data: followupListData, refetch: refreshFollowupObjects } =
    useSuiClientQuery(
      "multiGetObjects",
      {
        ids: followupIds,
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
        enabled: followupIds.length > 0,
      }
    );

  // Get clarification IDs
  const [clarificationIds, setClarificationIds] = useState([]);

  useEffect(() => {
    if (clarificationEventsData && clarificationEventsData.length > 0) {
      const ids = clarificationEventsData.map(
        (event) => event.parsedJson.content_id
      );
      setClarificationIds(ids);
    }
  }, [clarificationEventsData]);

  // Fetch clarification objects
  const { data: clarificationListData } = useSuiClientQuery(
    "multiGetObjects",
    {
      ids: clarificationIds,
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
      enabled: clarificationIds.length > 0,
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

  // Process answers
  useEffect(() => {
    if (eventsData) {
      const ids = eventsData.flatMap((event) => event.parsedJson.content_id);
      const timestampMs = eventsData.flatMap((event) => event.timestampMs);
      setObjectIds(ids);
      setTimeStampMs(timestampMs);
    }
  }, [id, eventsData]);

  // Process follow-ups
  useEffect(() => {
    if (followupListData && followupEventsData) {
      const followupsMap = {};

      followupListData.forEach((followup, index) => {
        const relatedAnswerId = followup.data.content.fields.related_to;
        if (!followupsMap[relatedAnswerId]) {
          followupsMap[relatedAnswerId] = [];
        }

        followupsMap[relatedAnswerId].push({
          data: followup,
          timestampMs: followupEventsData[index]?.timestampMs,
        });
      });

      setFollowups(followupsMap);
    }
  }, [followupListData, followupEventsData]);

  // Process clarifications
  useEffect(() => {
    if (clarificationListData && clarificationEventsData) {
      const clarificationsMap = {};
      console.log("Clarification events data:", clarificationEventsData);
      console.log("Clarification list data:", clarificationListData);

      clarificationListData.forEach((clarification, index) => {
        const relatedFollowupId = clarification.data.content.fields.related_to;
        if (!clarificationsMap[relatedFollowupId]) {
          clarificationsMap[relatedFollowupId] = [];
        }

        clarificationsMap[relatedFollowupId].push({
          data: clarification,
          timestampMs: clarificationEventsData[index]?.timestampMs,
        });
      });

      setClarifications(clarificationsMap);
    }
  }, [clarificationListData, clarificationEventsData]);

  // Merge answers with their follow-ups and clarifications
  useEffect(() => {
    console.log("Answer list data:", answerListData);

    if (answerListData) {
      const processedAnswers = answerListData.map((answer, index) => {
        const answerId = answer.data.objectId;
        const answerFollowups = followups[answerId] || [];

        // Add clarifications to each follow-up
        console.log("Answer followups:", answerFollowups);

        const processedFollowups = answerFollowups.map((followup) => {
          const followupId = followup.data.data.objectId;
          return {
            ...followup,
            clarifications: clarifications[followupId] || [],
          };
        });

        return {
          ...answer,
          timestampMs: timestampMs[index],
          followups: processedFollowups,
          scholarInitials: "SC", // Placeholder - you might want to compute this
          scholarTitle: "Scholar", // Placeholder - you might want to get real data
        };
      });

      console.log("Processed answers:", processedAnswers);

      setAnswers(processedAnswers);
    }
  }, [answerListData, timestampMs, followups, clarifications]);

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
    } else if (contentType === "followup") {
      likeContent(contentId, refreshFollowups);
    } else if (contentType === "clarification") {
      likeContent(contentId, refreshClarifications);
    }
  };

  // Updated handleSendReward function in QuestionDetails.jsx
  const handleSendReward = (objectId, amount) => {
    setRewardSent(false); // Reset before sending new reward
    sendReward(objectId, amount, () => {
      setRewardSent(true);

      setTimeout(() => {
        setRewardSent(false);
      }, 1000);
    });
  };

  // Function to handle follow-up creation
  const handleCreateFollowup = (
    answerId,
    questionId,
    title,
    content,
    metadata,
    onSuccess
  ) => {
    createFollowup(answerId, questionId, title, content, metadata, () => {
      refreshFollowups();
      refreshFollowupObjects();
      if (onSuccess) onSuccess();
    });
  };

  // Function to handle clarification creation
  const handleCreateClarification = (
    followupId,
    answerId,
    title,
    content,
    metadata,
    onSuccess
  ) => {
    createClarification(
      scholarCapId,
      followupId,
      answerId,
      title,
      content,
      metadata,
      () => {
        refreshClarifications();
        if (onSuccess) onSuccess();
      }
    );
  };

  return (
    <main className={styles["question-details"]}>
      <Breadcrumb />
      {!isPending ? (
        <>
          <Question
            question={question?.fields}
            likeQuestion={() => handleLike(id, "question")}
          />

          <Answers
            answers={answers}
            sortOrder={sortOrder}
            handleSortChange={handleSortChange}
            religySyncPackageId={religySyncPackageId}
            platformId={platformId}
            suiClient={suiClient}
            signAndExecute={signAndExecute}
            likeAnswer={handleLike}
            sendReward={handleSendReward}
            isRewardSent={rewardSent}
            createClarification={handleCreateClarification}
            createFollowup={handleCreateFollowup}
            // scholarCapId={scholarCapId}
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
        </>
      ) : (
        <Loading message="Loading question details..." />
      )}
    </main>
  );
};
export default QuestionDetails;
