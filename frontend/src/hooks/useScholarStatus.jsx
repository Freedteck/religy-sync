import { Transaction } from "@mysten/sui/transactions";
import { useCallback, useEffect, useState } from "react";

const useScholarStatus = (
  suiClient,
  religySyncPackageId,
  platformId,
  account
) => {
  const [isScholar, setIsScholar] = useState(false);
  const [scholarCapId, setScholarCapId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is a scholar

  const checkIfScholar = useCallback(
    async (address) => {
      if (!address || !suiClient || !platformId || !religySyncPackageId) {
        return false;
      }

      const tx = new Transaction();

      tx.moveCall({
        target: `${religySyncPackageId}::religy_sync::is_scholar`,
        arguments: [tx.object(platformId), tx.pure.address(address)],
      });

      try {
        const result = await suiClient.devInspectTransactionBlock({
          transactionBlock: tx,
          sender: address,
        });

        if (result?.results?.[0]?.returnValues?.[0]) {
          const returnValue = result.results[0].returnValues[0];

          // Handle array format like [1]
          if (Array.isArray(returnValue) && returnValue.length > 0) {
            if (Array.isArray(returnValue[0])) {
              return returnValue[0][0] === 1;
            }
            return returnValue[0] === 1;
          }

          // Handle direct boolean or number
          return returnValue === true || returnValue === 1;
        }

        return false;
      } catch (error) {
        console.error("Error checking scholar status:", error);
        return false;
      }
    },
    [platformId, religySyncPackageId, suiClient]
  );

  // Find the ScholarCap ID owned by the current account
  const fetchScholarCapId = useCallback(
    async (address) => {
      if (!address || !suiClient) return null;

      try {
        // Query for objects owned by the current account
        const ownedObjects = await suiClient.getOwnedObjects({
          owner: address,
          options: {
            showType: true,
            showContent: true,
          },
          filter: {
            // Filter for ScholarCap objects
            StructType: `${religySyncPackageId}::religy_sync::ScholarCap`,
          },
        });

        if (ownedObjects.data && ownedObjects.data.length > 0) {
          // Found a ScholarCap object
          return ownedObjects.data[0].data.objectId;
        }

        return null;
      } catch (error) {
        console.error("Error fetching ScholarCap:", error);
        return null;
      }
    },
    [religySyncPackageId, suiClient]
  );

  // Fetch scholar details whenever dependencies change
  useEffect(() => {
    const fetchScholarDetails = async () => {
      if (account) {
        setLoading(true);
        try {
          // Check if the user is a scholar
          const status = await checkIfScholar(account.address);
          setIsScholar(status);

          // If they are a scholar, fetch their ScholarCap
          if (status) {
            const capId = await fetchScholarCapId(account.address);
            setScholarCapId(capId);
          }
        } catch (error) {
          console.error("Error checking scholar details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchScholarDetails();
  }, [account, checkIfScholar, fetchScholarCapId]);

  return {
    isScholar,
    scholarCapId,
    loading,
    checkIfScholar,
    fetchScholarCapId,
  };
};

export default useScholarStatus;
