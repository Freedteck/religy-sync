import { useEffect, useState } from "react";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import styles from "./Applications.module.css";
import { useNetworkVariables } from "../../../../config/networkConfig";
import useScholarApplications from "../../../../hooks/useScholarApplications";
import useCreateContent from "../../../../hooks/useCreateContent";
import ApplicationRow from "../../../../components/application-row/ApplicationRow";
import { formatTime } from "../../../../utils/timeFormatter";
import ApplicationDetailsModal from "../../../../modals/application-details-modal/ApplicationDetailsModal";

const Applications = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [faithFilter, setFaithFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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

    if (showDetailsModal) {
      setShowDetailsModal(false);
    }
  };

  const viewApplicationDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const filteredApplications = applications.filter((app) => {
    if (activeTab !== "all" && app.status !== activeTab) return false;

    if (
      searchTerm &&
      !app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !app.faith_tradition?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    if (faithFilter && app.faith_tradition !== faithFilter) return false;

    return true;
  });

  useEffect(() => {}, [filteredApplications]);

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortOrder === "newest") {
      return b.timestamp - a.timestamp;
    } else {
      return a.timestamp - b.timestamp;
    }
  });

  const currentApplications = sortedApplications;

  const pendingCount = applications.filter(
    (app) => app.status === "pending"
  ).length;
  const approvedCount = applications.filter(
    (app) => app.status === "approved"
  ).length;
  const rejectedCount = applications.filter(
    (app) => app.status === "rejected"
  ).length;

  return (
    <main className={styles.mainContent}>
      <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${
            activeTab === "pending" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending ({pendingCount})
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "approved" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("approved")}
        >
          Approved ({approvedCount})
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "rejected" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("rejected")}
        >
          Rejected ({rejectedCount})
        </div>
      </div>

      <div className={styles.searchFilter}>
        <div className={styles.filterBar}>
          <div className={styles.filterDropdown}>
            <select
              value={faithFilter}
              onChange={(e) => setFaithFilter(e.target.value)}
            >
              <option value="">All Faith Traditions</option>
              <option value="Judaism">Judaism</option>
              <option value="Christianity">Christianity</option>
              <option value="Islam">Islam</option>
              <option value="Buddhism">Buddhism</option>
              <option value="Hinduism">Hinduism</option>
              <option value="Sikhism">Sikhism</option>
            </select>
          </div>
          <div className={styles.filterDropdown}>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Sort By: Newest First</option>
              <option value="oldest">Sort By: Oldest First</option>
            </select>
          </div>
        </div>
        <div className={styles.searchBar}>
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by address or faith tradition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
          ) : currentApplications.length === 0 ? (
            <tr>
              <td colSpan="6" className={styles.emptyText}>
                No applications found
              </td>
            </tr>
          ) : (
            currentApplications.map((app) => (
              <ApplicationRow
                key={app.applicant}
                address={app.applicant}
                name={app.name || "N/A"}
                tradition={app.faith_tradition || "N/A"}
                date={formatTime(app.timestamp)}
                status={app.status}
                hasView={true}
                onView={() => viewApplicationDetails(app)}
              />
            ))
          )}
        </tbody>
      </table>

      <ApplicationDetailsModal
        show={showDetailsModal}
        application={selectedApplication}
        onApprove={() =>
          handleApproveReject(selectedApplication.applicant, true)
        }
        onReject={() =>
          handleApproveReject(selectedApplication.applicant, false)
        }
        onClose={() => setShowDetailsModal(false)}
      />

      {applicationsError && (
        <div className={styles.errorMessage}>
          Error loading applications: {applicationsError}
        </div>
      )}
    </main>
  );
};

export default Applications;
