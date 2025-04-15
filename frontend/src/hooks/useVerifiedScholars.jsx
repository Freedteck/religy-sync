import { useCallback, useEffect, useState } from "react";
import { useSuiClientQuery } from "@mysten/dapp-kit";

const useVerifiedScholars = (religySyncPackageId, refreshTrigger = 0) => {
  const [scholars, setScholars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    data: scholarEvents,
    refetch: refetchScholars,
    isPending: isQueryPending,
    isError: isQueryError,
    error: queryError,
  } = useSuiClientQuery(
    "queryEvents",
    {
      query: {
        MoveEventType: `${religySyncPackageId}::religy_sync::ScholarVerified`,
      },
      order: "descending",
    },
    {
      enabled: !!religySyncPackageId,
    }
  );

  useEffect(() => {
    setLoading(isQueryPending);

    if (isQueryError) {
      setError(queryError?.message || "Failed to fetch scholars");
    } else {
      setError(null);
    }

    if (scholarEvents?.data) {
      const scholarData = scholarEvents.data.map((event) => ({
        scholar: event.parsedJson.scholar,
        faith_tradition: event.parsedJson.faith_tradition,
        timestamp: event.timestampMs,
      }));

      setScholars(scholarData);
      setLoading(false);
    }
  }, [scholarEvents, isQueryPending, isQueryError, queryError]);

  // Refresh scholars - can be called manually
  const refreshScholars = useCallback(() => {
    setLoading(true);
    return refetchScholars();
  }, [refetchScholars]);

  // Trigger refetch when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger > 0) {
      refetchScholars();
    }
  }, [refreshTrigger, refetchScholars]);

  return {
    scholars,
    loading,
    error,
    refreshScholars,
  };
};

export default useVerifiedScholars;
