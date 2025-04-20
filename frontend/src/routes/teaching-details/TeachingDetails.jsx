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
import Loading from "../../components/loading/Loading";

const TeachingDetails = () => {
  const { id } = useParams();
  const [openTipModal, setOpenTipModal] = useState(false);
  const [insightData, setInsightData] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const { data: eventsData, isLoading: eventsLoading } =
    useSuiClientInfiniteQuery(
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

  const { contentList: insightList, refetch: refetchData } =
    useContentFromEvents(eventsData);

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
    if (insightList) {
      const filteredInsights = insightList.filter(
        (insight) => insight.data.objectId === id
      );
      setInsightData(filteredInsights[0]);
      setLoading(false);
    }
  }, [insightList, id]);

  if (loading || eventsLoading) {
    return <Loading message="Loading teaching details..." />;
  }

  if (!insight) return <div>Insight not found</div>;

  const extractYouTubeId = (url) => {
    if (!url) return null;
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname === "youtu.be") {
        return parsedUrl.pathname.slice(1);
      }
      if (parsedUrl.hostname.includes("youtube.com")) {
        return (
          parsedUrl.searchParams.get("v") ||
          parsedUrl.pathname.split("/embed/")[1]
        );
      }
      return null;
    } catch (e) {
      console.log(e);

      return null;
    }
  };

  const metadata = insightData
    ? parseMetadata(insightData.data.content.fields.metadata)
    : {};
  const isVideo = metadata.type === "video";
  const youtubeId = extractYouTubeId(metadata.videoUrl);

  return (
    <div className={styles.container}>
      <Link to="/teachings" className={styles.backBtn}>
        ← Back to Insights
      </Link>

      <div className={styles.insightHeader}>
        <span
          className={`${styles.insightTypeBadge} ${
            isVideo ? styles.videoBadge : ""
          }`}
        >
          {metadata.type}
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
          <div className={styles.metaItem}>
            👍 {insightData?.data.content.fields.likes} Likes
          </div>
        </div>
      </div>

      {isVideo ? (
        <div className={styles.videoContainer}>
          {youtubeId ? (
            // YouTube embed
            <div className={styles.videoWrapper}>
              <iframe
                src={`https://www.youtube.com/embed/qJARfWkQyH4`}
                className={styles.videoPlayer}
                // frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={insightData?.data.content.fields.title}
              ></iframe>
            </div>
          ) : (
            // Native video player for direct video files
            <video
              className={styles.videoPlayer}
              controls
              playsInline
              poster={metadata.thumbnailUrl}
            >
              <source src={metadata.videoUrl} type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
          )}
        </div>
      ) : (
        <div className={styles.insightHero}>
          <img
            src={metadata.thumbnailUrl}
            alt={insightData?.data.content.fields.title}
            loading="lazy"
          />
        </div>
      )}

      <div className={styles.insightContent}>
        <div className={styles.contentBlock}>
          <p>{metadata.description}</p>
        </div>

        <div className={styles.contentBlock}>
          {insightData?.data.content.fields.body}
        </div>

        <section className={styles.below}>
          <div className={styles.tagsContainer}>
            {metadata?.tags?.map((tag, index) => (
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
                  {insightData?.data.content.fields?.likes > 1
                    ? "Likes"
                    : "Like"}
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
