import { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import {
  useSuiClient,
  useSuiClientInfiniteQuery,
  useSuiClientQuery,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { useNavigate, useParams } from "react-router-dom";
import { useNetworkVariables } from "../../config/networkConfig";
import useScholarApplications from "../../hooks/useScholarApplications";
import { truncateAddress } from "../../utils/truncateAddress";
import { parseMetadata } from "../../utils/helpers";
import ContentList from "../../components/content-list/ContentList";
import Loading from "../../components/loading/Loading";
import useScholarStatus from "../../hooks/useScholarStatus";
import TeachingCard from "../../components/teaching-card/TeachingCard";
import Button from "../../components/button/Button";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("questions");
  const [currentUser, setCurrentUser] = useState(undefined);
  const [userData, setUserData] = useState(undefined);
  const [userContent, setUserContent] = useState({
    questions: [],
    answers: [],
    insights: [],
    prayers: [],
  });
  const { id: userAddress } = useParams();
  const suiClient = useSuiClient();
  const navigate = useNavigate();
  const account = useCurrentAccount();

  const { religySyncPackageId, platformId } = useNetworkVariables(
    "religySyncPackageId",
    "platformId",
    "adminCapId"
  );

  // Check if the viewed profile belongs to a scholar
  const { _isScholar, loading: isScholarLoading } = useScholarStatus(
    suiClient,
    religySyncPackageId,
    platformId,
    account,
    userAddress
  );

  // Fetch all content created by this user
  const { data: userContentEvents } = useSuiClientInfiniteQuery(
    "queryEvents",
    {
      query: {
        MoveEventType: `${religySyncPackageId}::religy_sync::ContentCreated`,
      },
      cursor: null,
    },
    {
      enabled: !!userAddress,
      select: (data) =>
        data.pages
          .flatMap((page) => page.data)
          .filter((x) => x.sender === userAddress),
    }
  );

  // Fetch the actual content objects
  const contentIds =
    userContentEvents?.map((event) => event.parsedJson.content_id) || [];
  const { data: contentObjects } = useSuiClientQuery(
    "multiGetObjects",
    {
      ids: contentIds,
      options: {
        showContent: true,
        showDisplay: true,
        showOwner: true,
        showPreviousTransaction: false,
        showStorageReward: false,
      },
    },
    {
      enabled: contentIds.length > 0,
    }
  );

  // Organize content by type when we get the data
  useEffect(() => {
    if (contentObjects) {
      const questions = [];
      const answers = [];
      const insights = [];
      const prayers = [];

      contentObjects.forEach((obj, index) => {
        const event = userContentEvents[index];
        const contentType = event.parsedJson.content_type;
        const contentWithTimestamp = {
          ...obj,
          timestampMs: event.timestampMs,
        };

        if (contentType === 0) {
          questions.push(contentWithTimestamp);
        } else if (contentType === 1) {
          answers.push(contentWithTimestamp);
        } else if (contentType === 2) {
          insights.push(contentWithTimestamp);
        } else if (contentType === 3) {
          prayers.push(contentWithTimestamp);
        }
      });

      setUserContent({
        questions,
        answers,
        insights,
        prayers,
      });
    }
  }, [contentObjects, userContentEvents]);

  const { applications } = useScholarApplications(
    suiClient,
    religySyncPackageId,
    platformId
  );

  useEffect(() => {
    if (applications) {
      const user = applications?.find((app) => app.applicant === userAddress);
      setCurrentUser(user || null);

      if (user) {
        const parsedInfo = parseMetadata(user.additionalInfo);
        setUserData({
          name: user.name,
          email: parsedInfo.email,
          denomination: parsedInfo.denomination,
          expertise: parsedInfo.expertise,
          otherExpertise: parsedInfo.otherExpertise,
          credentials: user.credentials,
          faithTradition: user.faith_tradition,
          status: user.status,
          wallet: user.applicant,
        });
      } else {
        // Explicitly set as non-scholar
        setUserData({
          wallet: userAddress,
          status: "not-approved",
        });
      }
    } else {
      // Handle case where applications couldn't be loaded
      setUserData({
        wallet: userAddress,
        status: "unknown",
      });
    }
  }, [applications, userAddress]);

  // Show loading state until all data is loaded
  if (isScholarLoading || currentUser === undefined || userData === undefined) {
    return <Loading message="Loading profile..." />;
  }

  const isApprovedScholar = userData?.status === "approved";

  const getInitials = (name) => {
    if (!name)
      return truncateAddress(userAddress).substring(0, 2).toUpperCase();
    const names = name.split(" ");
    return names
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Calculate stats from actual content
  const scholarStats = {
    answers: userContent.answers.length,
    questions: userContent.questions.length,
    insights: userContent.insights.length,
    prayers: userContent.prayers.length,
  };

  // Mock about data
  const aboutData = {
    biography: [
      `${userData.name} is a ${
        userData.faithTradition
      } scholar specializing in ${userData.expertise?.join(", ")}.`,
      `With credentials in ${userData.credentials}, they bring deep knowledge to the community.`,
    ],
    focus: userData.expertise || [],
    languages: ["English"],
  };

  return (
    <main className={styles.profile}>
      {/* Profile Header */}
      <div
        className={`${styles.profileHeader} ${
          userData === undefined ? styles.loading : ""
        }`}
      >
        <div
          className={`${styles.profileAvatar} ${
            userData === undefined ? styles.loading : ""
          }`}
        >
          {getInitials(userData?.name)}
        </div>
        <div className={styles.profileInfo}>
          <h1>{userData?.name || truncateAddress(userAddress)}</h1>
          <div className={styles.profileMeta}>
            {userData?.status !== undefined && (
              <div
                className={`${styles.verifiedBadge} ${
                  isApprovedScholar ? styles.verified : styles.unverified
                }`}
              >
                {isApprovedScholar ? "Verified Scholar" : "Not Verified"}
              </div>
            )}
            <div className={styles.profileWallet}>
              {truncateAddress(userAddress)}
            </div>
          </div>
          {userData?.email && <p className={styles.email}>{userData.email}</p>}
          {(userData?.faithTradition || userData?.denomination) && (
            <p className={styles.specialty}>
              {userData.faithTradition}{" "}
              {userData.denomination && `• ${userData.denomination}`}
            </p>
          )}
          {(userData?.expertise?.length > 0 || userData?.otherExpertise) && (
            <div className={styles.expertise}>
              {userData.expertise?.map((exp, i) => (
                <span key={i} className={styles.expertiseTag}>
                  {exp}
                </span>
              ))}
              {userData.otherExpertise && (
                <span className={styles.expertiseTag}>
                  {userData.otherExpertise}
                </span>
              )}
            </div>
          )}
          <div className={styles.profileStats}>
            {isApprovedScholar && (
              <div
                className={`${styles.statItem} ${
                  userData === undefined ? styles.loading : ""
                }`}
              >
                <div className={styles.statValue}>{scholarStats.answers}</div>
                <div className={styles.statLabel}>Answers</div>
              </div>
            )}
            <div
              className={`${styles.statItem} ${
                userData === undefined ? styles.loading : ""
              }`}
            >
              <div className={styles.statValue}>{scholarStats.questions}</div>
              <div className={styles.statLabel}>Questions</div>
            </div>
            {!isApprovedScholar && (
              <button
                className={styles["apply-button"]}
                onClick={() => {
                  navigate("/scholar-application");
                }}
              >
                Apply for scholar
              </button>
            )}
            {isApprovedScholar && (
              <div
                className={`${styles.statItem} ${
                  userData === undefined ? styles.loading : ""
                }`}
              >
                <div className={styles.statValue}>{scholarStats.insights}</div>
                <div className={styles.statLabel}>Insights/Teachings</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className={styles.profileTabs}>
        <ul className={styles.tabList}>
          {isApprovedScholar && (
            <li
              className={`${styles.tabItem} ${
                activeTab === "answers" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("answers")}
            >
              Answers ({scholarStats.answers})
            </li>
          )}
          <li
            className={`${styles.tabItem} ${
              activeTab === "questions" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("questions")}
          >
            Questions ({scholarStats.questions})
          </li>

          <li
            className={`${styles.tabItem} ${
              activeTab === "prayers" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("prayers")}
          >
            Prayers ({scholarStats.prayers})
          </li>

          {isApprovedScholar && (
            <>
              <li
                className={`${styles.tabItem} ${
                  activeTab === "insights" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("insights")}
              >
                Insights/Teachings ({scholarStats.insights})
              </li>
              <li
                className={`${styles.tabItem} ${
                  activeTab === "credentials" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("credentials")}
              >
                Credentials
              </li>
              <li
                className={`${styles.tabItem} ${
                  activeTab === "about" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("about")}
              >
                About
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Answers Tab Content */}
      {isApprovedScholar && (
        <div
          className={`${styles.contentContainer} ${
            activeTab !== "answers" ? styles.hidden : ""
          }`}
        >
          {userContent.answers.length > 0 ? (
            <ContentList
              items={userContent.answers}
              type="answer"
              showQuestionLink={true}
            />
          ) : (
            <div className={styles.emptyState}>
              <p>No answers yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Questions Tab Content */}
      <div
        className={`${styles.contentContainer} ${
          activeTab !== "questions" ? styles.hidden : ""
        }`}
      >
        {userContent.questions.length > 0 ? (
          <ContentList items={userContent.questions} type="question" />
        ) : (
          <div className={styles.emptyState}>
            <p>No questions yet.</p>
          </div>
        )}
      </div>

      {/* Prayers Tab Content */}
      <div
        className={`${styles.contentContainer} ${
          activeTab !== "prayers" ? styles.hidden : ""
        }`}
      >
        {userContent.prayers.length > 0 ? (
          <ContentList items={userContent.prayers} type="prayer" />
        ) : (
          <div className={styles.emptyState}>
            <p>No prayers yet.</p>
          </div>
        )}
      </div>

      {/* Insights Tab Content - Only visible for scholars */}
      {isApprovedScholar && (
        <div
          className={`${styles.contentContainer} ${
            activeTab !== "insights" ? styles.hidden : styles.insights
          }`}
        >
          {userContent.insights.length > 0 ? (
            userContent.insights.map((insight) => (
              <TeachingCard key={insight.data?.objectId} teaching={insight} />
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>No insights/teachings yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Credentials Tab Content */}
      {isApprovedScholar && (
        <div
          className={`${styles.credentialsContainer} ${
            activeTab !== "credentials" ? styles.hidden : ""
          }`}
        >
          <div className={styles.credentialCard}>
            <div className={styles.credentialTitle}>Religious Credentials</div>
            <div className={styles.credentialMeta}>
              <div className={styles.credentialIssuer}>Self-attested</div>
            </div>
            <div className={styles.credentialContent}>
              {userData.credentials || "No detailed credentials provided"}
            </div>
          </div>

          <div className={styles.credentialCard}>
            <div className={styles.credentialTitle}>Faith Tradition</div>
            <div className={styles.credentialContent}>
              {userData.faithTradition}
            </div>
          </div>
        </div>
      )}

      {/* About Tab Content */}
      {isApprovedScholar && (
        <div
          className={`${styles.aboutContainer} ${
            activeTab !== "about" ? styles.hidden : ""
          }`}
        >
          <div className={styles.aboutContent}>
            <h3>Biography</h3>
            {aboutData.biography.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            <h3>Focus Areas</h3>
            {aboutData.focus.map((item, index) => (
              <p key={index}>• {item}</p>
            ))}

            <h3>Languages</h3>
            {aboutData.languages.map((language, index) => (
              <p key={index}>• {language}</p>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default Profile;
