import { Link, useParams } from "react-router-dom";
import styles from "./TeachingDetails.module.css";
import { teachings } from "../../samples/teachings";
import RelatedTeachings from "../../components/related-teachings/RelatedTeachings";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientInfiniteQuery,
} from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { truncateAddress } from "../../utils/truncateAddress";
import { parseMetadata } from "../../utils/helpers";
import Jazzicon from "react-jazzicon";
import useCreateContent from "../../hooks/useCreateContent";
import { useNetworkVariables } from "../../config/networkConfig";
import TipModal from "../../modals/tip-modal/TipModal";
import useContentFromEvents from "../../hooks/useContentFromEvent";
import { formatTime } from "../../utils/timeFormatter";

const TeachingDetails = () => {
  const { id } = useParams();
  const [openTipModal, setOpenTipModal] = useState(false);
  const [insightData, setInsightData] = useState(null);
  const { religySyncPackageId, platformId } = useNetworkVariables(
    "religySyncPackageId",
    "platformId"
  );
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();

  const insight = teachings.find((teaching) => teaching.id === parseInt(1));
  const relatedInsights = teachings
    .filter((t) => t.id !== insight.id)
    .slice(0, 3);

  const { likeContent, sendReward } = useCreateContent(
    religySyncPackageId,
    platformId,
    suiClient,
    signAndExecute
  );

  const {
    data: eventsData,
    refetch: refetchData,
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

  const { contentList: insightList } = useContentFromEvents(eventsData);

  const handleLike = () => {
    if (account) {
      likeContent(insightData?.data.content.fields?.id.id, () => refetchData());
    }
  };

  const handleTip = () => {
    if (account) {
      setOpenTipModal(true);
    }
  };

  const handleTipModalClose = () => {
    setOpenTipModal(false);
  };

  const handleTipSubmit = (contentId, amount) => {
    if (account) {
      sendReward(contentId, amount, () => {
        setOpenTipModal(false);
      });
    }
  };

  useEffect(() => {
    const filteredInsights = insightList.filter(
      (insight) => insight.data.objectId === id
    );
    setInsightData(filteredInsights[0]);
  }, [insightList, id]);

  if (!insight) return <div>Insight not found</div>;

  return (
    <div className={styles.container}>
      <Link to="/teachings" className={styles.backBtn}>
        ← Back to Insights
      </Link>

      <div className={styles.insightHeader}>
        <span
          className={`${styles.insightTypeBadge} ${
            parseMetadata(insightData?.data.content.fields.metadata).type ===
            "video"
              ? styles.videoBadge
              : ""
          }`}
        >
          {parseMetadata(insightData?.data.content.fields.metadata).type}
        </span>
        <h1 className={styles.insightTitle}>
          {insightData?.data.content.fields.title}
        </h1>

        <div className={styles.insightMeta}>
          <div className={styles.scholarInfo}>
            <Jazzicon
              diameter={30}
              seed={parseInt(
                insightData?.data.content.fields.creator.slice(2, 8),
                16
              )}
            />
            <span className={styles.scholarName}>
              {truncateAddress(insightData?.data.content.fields?.creator)}
            </span>
          </div>
          <div className={styles.metaItem}>
            📅 {formatTime(insightData?.timestampMs)}
          </div>
          {/* <div className={styles.metaItem}>⏱️ 8 min read</div> */}
          <div className={styles.metaItem}>
            👍 {insightData?.data.content.fields.likes} Likes
          </div>
        </div>
      </div>

      <div className={styles.insightHero}>
        <img
          src={
            parseMetadata(insightData?.data.content.fields.metadata)
              .thumbnailUrl
          }
          alt={insightData?.data.content.fields.title}
        />
      </div>

      <div className={styles.insightContent}>
        <div className={styles.contentBlock}>
          <p>
            {
              parseMetadata(insightData?.data.content.fields.metadata)
                .description
            }
          </p>
        </div>

        <div className={styles.contentBlock}>
          {insightData?.data.content.fields.body}
        </div>

        <section className={styles.below}>
          <div className={styles.tagsContainer}>
            {parseMetadata(
              insightData?.data.content.fields.metadata
            )?.tags?.map((tag, index) => (
              <span className={styles.tag} key={index}>
                {tag}
              </span>
            ))}
          </div>
          <div className={styles.actionsContainer}>
            <div className={styles.actionsGroup}>
              <button className={styles.actionBtn} onClick={handleLike}>
                <svg className={styles.actionIcon} viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className={styles.actionText}>
                  {insightData?.data.content.fields.likes}{" "}
                  <span className={styles.actionText}>
                    {insightData?.data.content.fields?.likes > 1
                      ? "Likes"
                      : "Like"}
                  </span>
                </span>
              </button>
              <button className={styles.actionBtn}>
                <svg className={styles.actionIcon} viewBox="0 0 24 24">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                </svg>
                <span className={styles.actionText}>Share</span>
              </button>
              <button className={styles.actionBtn} onClick={handleTip}>
                <svg className={styles.actionIcon} viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 11.41L16 12l-2.59-1.41L12 8l-1.41 2.59L8 12l2.59 1.41L12 16l1.41-2.59z" />
                </svg>
                Tip
              </button>
            </div>
          </div>
        </section>
      </div>
      <RelatedTeachings insights={relatedInsights} />

      <TipModal
        isOpen={openTipModal}
        answerId={insightData?.data.content.fields?.id.id}
        onClose={handleTipModalClose}
        sendReward={handleTipSubmit}
      />
    </div>
  );
};

export default TeachingDetails;
