import { Link, useParams } from "react-router-dom";
import styles from "./TeachingDetails.module.css";
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
import {
  FaArrowLeft,
  FaHeart,
  FaShare,
  FaGift,
  FaCalendarAlt,
} from "react-icons/fa";

const TeachingDetails = () => {
  const { id } = useParams();
  const [openTipModal, setOpenTipModal] = useState(false);
  const [relatedInsights, setRelatedInsights] = useState([]);
  const [insightData, setInsightData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { religySyncPackageId, platformId } = useNetworkVariables(
    "religySyncPackageId",
    "platformId"
  );
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();

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
      const related = insightList
        .filter(
          (insight) =>
            insight.data.content.fields.creator ===
              filteredInsights[0].data.content.fields.creator &&
            insight.data.objectId !== id
        )
        .slice(0, 3);
      setRelatedInsights(related);
      setLoading(false);
    }
  }, [insightList, id]);

  if (loading || eventsLoading) {
    return <Loading message="Loading teaching details..." />;
  }

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
        <FaArrowLeft /> Back to Insights
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
            <FaCalendarAlt /> {formatTime(insightData?.timestampMs)}
          </div>
          <div className={styles.metaItem}>
            <FaHeart /> {insightData?.data.content.fields.likes} Likes
          </div>
        </div>
      </div>

      {isVideo ? (
        <div className={styles.videoContainer}>
          {youtubeId ? (
            <div className={styles.videoWrapper}>
              <iframe
                src={metadata.videoUrl}
                className={styles.videoPlayer}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={insightData?.data.content.fields.title}
              ></iframe>
            </div>
          ) : (
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
                <FaHeart className={styles.actionIcon} />
                <span className={styles.actionText}>
                  {insightData?.data.content.fields.likes}{" "}
                  {insightData?.data.content.fields?.likes > 1
                    ? "Likes"
                    : "Like"}
                </span>
              </button>
              <button className={styles.actionBtn}>
                <FaShare className={styles.actionIcon} />
                <span className={styles.actionText}>Share</span>
              </button>
              <button className={styles.actionBtn} onClick={handleTip}>
                <FaGift className={styles.actionIcon} />
                <span className={styles.actionText}>Tip</span>
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
