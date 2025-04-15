import { Link } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useState } from "react";
import { useNetworkVariables } from "../../../../config/networkConfig";
import useScholarApplications from "../../../../hooks/useScholarApplications";
import useVerifiedScholars from "../../../../hooks/useVerifiedScholars";
import { truncateAddress } from "../../../../utils/truncateAddress";
import { formatTime } from "../../../../utils/timeFormatter";
import useCreateContent from "../../../../hooks/useCreateContent";
import ApplicationRow from "../../../../components/application-row/ApplicationRow";

const Dashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const suiClient = useSuiClient();
  const { religySyncPackageId, platformId, adminCapId } = useNetworkVariables(
    "religySyncPackageId",
    "platformId",
    "adminCapId"
  );

  const {
    applications,
    loading: applicationsLoading,
    error: applicationsError,
    refreshApplications,
  } = useScholarApplications(suiClient, religySyncPackageId, platformId);

  // Use the new hook for scholars
  const {
    scholars,
    loading: scholarsLoading,
    error: scholarsError,
    // refreshScholars,
  } = useVerifiedScholars(religySyncPackageId, refreshTrigger);

  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const { approveScholar, revokeScholar } = useCreateContent(
    religySyncPackageId,
    platformId,
    suiClient,
    signAndExecute
  );

  const handleApproveReject = (applicant, shouldApprove) => {
    shouldApprove
      ? approveScholar(adminCapId, applicant, true, refreshApplications)
      : revokeScholar(adminCapId, applicant, refreshApplications);

    // Increment refresh trigger to force scholar data to refresh
    setRefreshTrigger((prev) => prev + 1);
  };

  // Get pending applications (those with status pending)
  const pendingApplications = applications.filter(
    (app) => app.status === "pending"
  );

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        {applicationsError && (
          <div className={styles.errorMessage}>
            Error loading applications: {applicationsError}
          </div>
        )}

        {scholarsError && (
          <div className={styles.errorMessage}>
            Error loading scholars: {scholarsError}
          </div>
        )}

        <div className={styles.dashboardCards}>
          <StatCard
            value={applicationsLoading ? "..." : pendingApplications.length}
            label="Pending Applications"
          />
          <StatCard
            value={scholarsLoading ? "..." : scholars.length}
            label="Verified Scholars"
          />
          <StatCard value="27,453" label="Total Content Items" />
          <StatCard value="175,896" label="SUI Rewards Given" />
        </div>

        <div className={styles.quickActions}>
          <h2 className={styles.quickActionsTitle}>Quick Actions</h2>
          <div className={styles.quickActionsGrid}>
            <QuickActionCard
              icon="fas fa-user-plus"
              text="Verify New Scholar"
            />
            <QuickActionCard
              icon="fas fa-user-times"
              text="Revoke Scholar Access"
            />
            <QuickActionCard
              icon="fas fa-list-check"
              text="Review Applications"
            />
            <QuickActionCard
              icon="fas fa-chart-bar"
              text="View Platform Stats"
            />
          </div>
        </div>

        <div className={styles.sectionTitle}>
          <span>Recent Scholar Applications</span>
          <Link
            to="/admin/applications"
            className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
          >
            View All
          </Link>
        </div>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Faith Tradition</th>
              <th>Name</th>
              <th>Applied On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicationsLoading ? (
              <tr>
                <td colSpan="6" className={styles.loadingText}>
                  Loading applications...
                </td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.emptyText}>
                  No applications found
                </td>
              </tr>
            ) : (
              applications
                .slice(0, 5)
                .map((app) => (
                  <ApplicationRow
                    key={app.applicant}
                    address={app.applicant}
                    name={app.name || "N/A"}
                    tradition={app.faith_tradition || "N/A"}
                    date={formatTime(app.timestamp)}
                    status={app.status}
                    onApprove={() => handleApproveReject(app.applicant, true)}
                    onReject={() => handleApproveReject(app.applicant, false)}
                  />
                ))
            )}
          </tbody>
        </table>

        <div className={styles.sectionTitle}>
          <span>Recently Verified Scholars</span>
          <Link
            to="/admin/scholars"
            className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
          >
            View All
          </Link>
        </div>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Scholar Address</th>
              <th>Faith Tradition</th>
              <th>Verified On</th>
            </tr>
          </thead>
          <tbody>
            {scholarsLoading ? (
              <tr>
                <td colSpan="3" className={styles.loadingText}>
                  Loading scholars...
                </td>
              </tr>
            ) : scholars.length === 0 ? (
              <tr>
                <td colSpan="3" className={styles.emptyText}>
                  No verified scholars found
                </td>
              </tr>
            ) : (
              scholars.slice(0, 5).map((scholar) => (
                <tr key={scholar.scholar}>
                  <td>{truncateAddress(scholar.scholar)}</td>
                  <td>{scholar.faith_tradition || "N/A"}</td>
                  <td>{formatTime(scholar.timestamp)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
};

// Supporting smaller components
const StatCard = ({ value, label }) => (
  <div className={`${styles.card} ${styles.statCard}`}>
    <div className={styles.statValue}>{value}</div>
    <div className={styles.statLabel}>{label}</div>
  </div>
);

const QuickActionCard = ({ icon, text }) => (
  <div className={styles.quickActionCard}>
    <div className={styles.quickActionIcon}>
      <i className={icon}></i>
    </div>
    <div className={styles.quickActionText}>{text}</div>
  </div>
);

export default Dashboard;
