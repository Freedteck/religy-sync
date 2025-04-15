import { Transaction } from "@mysten/sui/transactions";
import { useCallback, useEffect, useState } from "react";
import { processApplicationDetails } from "../utils/helpers";

const useScholarApplications = (suiClient, religySyncPackageId, platformId) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch application events to get list of applicants
  const fetchApplicationEvents = useCallback(async () => {
    if (!suiClient || !religySyncPackageId) return [];

    try {
      const events = await suiClient.queryEvents({
        query: {
          MoveEventType: `${religySyncPackageId}::religy_sync::ScholarApplicationSubmitted`,
        },
        order: "descending",
      });

      return events.data.map((event) => ({
        applicant: event.parsedJson.applicant,
        faith_tradition: event.parsedJson.faith_tradition,
        timestamp: event.timestampMs,
        status: "pending", // Default status
      }));
    } catch (err) {
      console.error("Error fetching application events:", err);
      setError("Failed to fetch application events");
      return [];
    }
  }, [religySyncPackageId, suiClient]);

  // Fetch review events to update application statuses
  const fetchReviewEvents = useCallback(async () => {
    if (!suiClient || !religySyncPackageId) return [];

    try {
      const events = await suiClient.queryEvents({
        query: {
          MoveEventType: `${religySyncPackageId}::religy_sync::ScholarApplicationReviewed`,
        },
        order: "descending",
      });

      return events.data.map((event) => ({
        applicant: event.parsedJson.applicant,
        status: event.parsedJson.status, // 0: pending, 1: approved, 2: rejected
        timestamp: event.timestampMs,
      }));
    } catch (err) {
      console.error("Error fetching review events:", err);
      setError("Failed to fetch review events");
      return [];
    }
  }, [religySyncPackageId, suiClient]);

  // Get full details for a single application
  const getApplicationDetails = useCallback(
    async (applicant) => {
      if (!suiClient || !platformId || !religySyncPackageId || !applicant) {
        return null;
      }

      const tx = new Transaction();

      tx.moveCall({
        target: `${religySyncPackageId}::religy_sync::get_application_details`,
        arguments: [tx.object(platformId), tx.pure.address(applicant)],
      });

      try {
        const result = await suiClient.devInspectTransactionBlock({
          transactionBlock: tx,
          sender: applicant, // Using applicant as sender for inspection
        });

        if (result?.results?.[0]?.returnValues) {
          const returnValues = result.results[0].returnValues;

          // Parse the returned values - the function returns 7 values
          // (name, credentials, faith_tradition, additional_info, status, applied_at, reviewed_at)
          return processApplicationDetails(returnValues);
        }

        return null;
      } catch (error) {
        console.error(
          `Error getting application details for ${applicant}:`,
          error
        );
        return null;
      }
    },
    [platformId, religySyncPackageId, suiClient]
  );

  // Fetch all applications with details
  const fetchAllApplications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Get list of applicants from events
      const applicationsList = await fetchApplicationEvents();

      // 2. Get review events to update statuses
      const reviewEvents = await fetchReviewEvents();

      // 3. Create a map to update statuses based on review events
      const applicationMap = new Map();
      applicationsList.forEach((app) => {
        applicationMap.set(app.applicant, app);
      });

      // Update statuses based on review events
      reviewEvents.forEach((event) => {
        if (applicationMap.has(event.applicant)) {
          const app = applicationMap.get(event.applicant);
          applicationMap.set(event.applicant, {
            ...app,
            numericStatus: event.status,
            status:
              event.status === 1
                ? "approved"
                : event.status === 2
                ? "rejected"
                : "pending",
            reviewTimestamp: event.timestamp,
          });
        }
      });

      // 4. Fetch detailed information for each application
      const applicationsArray = Array.from(applicationMap.values());
      const detailedApplications = await Promise.all(
        applicationsArray.map(async (app) => {
          const details = await getApplicationDetails(app.applicant);
          if (details) {
            return {
              ...app,
              ...details,
              // Ensure status is consistent with review events
              numericStatus: details.status,
              status:
                details.status === 1
                  ? "approved"
                  : details.status === 2
                  ? "rejected"
                  : "pending",
            };
          }
          return app;
        })
      );

      // Filter out any null results (applications that might have been removed)
      const validApplications = detailedApplications.filter(
        (app) => app !== null
      );

      setApplications(validApplications);
      return validApplications;
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError("Failed to fetch applications");
      return [];
    } finally {
      setLoading(false);
    }
  }, [fetchApplicationEvents, fetchReviewEvents, getApplicationDetails]);

  // Refresh applications - can be called manually
  const refreshApplications = useCallback(() => {
    return fetchAllApplications();
  }, [fetchAllApplications]);

  // Initial fetch on mount and when dependencies change
  useEffect(() => {
    if (suiClient && religySyncPackageId && platformId) {
      fetchAllApplications();
    }
  }, [suiClient, religySyncPackageId, platformId, fetchAllApplications]);

  return {
    applications,
    loading,
    error,
    refreshApplications,
  };
};

export default useScholarApplications;
