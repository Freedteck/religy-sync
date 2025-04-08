import { Transaction } from "@mysten/sui/transactions";

/**
 * Helper functions for common Sui blockchain operations
 */

/**
 * Creates a transaction to call a Move function
 * @param {string} packageId - The package ID
 * @param {string} module - The module name
 * @param {string} function - The function name
 * @param {Array} args - Arguments for the function
 * @returns {Transaction} - The transaction object
 */
export const createMoveCallTransaction = (
  packageId,
  module,
  functionName,
  args
) => {
  const tx = new Transaction();

  tx.moveCall({
    target: `${packageId}::${module}::${functionName}`,
    arguments: args,
  });

  return tx;
};

/**
 * Format an object ID for display by truncating the middle
 * @param {string} objectId - The full object ID
 * @param {number} startChars - Number of characters to show at the beginning
 * @param {number} endChars - Number of characters to show at the end
 * @returns {string} - The formatted object ID
 */
export const formatObjectId = (objectId, startChars = 8, endChars = 8) => {
  if (!objectId || objectId.length <= startChars + endChars) {
    return objectId;
  }
  return `${objectId.substring(0, startChars)}...${objectId.substring(
    objectId.length - endChars
  )}`;
};

/**
 * Parse JSON metadata safely
 * @param {string} metadataStr - Metadata string to parse
 * @param {object} defaultValue - Default value if parsing fails
 * @returns {object} - The parsed metadata or default value
 */
export const parseMetadata = (metadataStr, defaultValue = {}) => {
  if (!metadataStr) return defaultValue;

  try {
    return JSON.parse(metadataStr);
  } catch (error) {
    console.error("Error parsing metadata:", error);
    return defaultValue;
  }
};

/**
 * Filter and sort content based on criteria
 * @param {Array} contentList - List of content objects
 * @param {object} filters - Filter criteria
 * @param {string} sortBy - Sort method
 * @returns {Array} - Filtered and sorted content
 */
export const filterAndSortContent = (
  contentList,
  filters,
  sortBy = "newest"
) => {
  if (!contentList || !Array.isArray(contentList)) return [];

  let filtered = [...contentList];
  const { faithTradition, status } = filters || {};

  // Apply faith tradition filter
  if (faithTradition) {
    filtered = filtered.filter((item) => {
      const metadata = parseMetadata(item.data?.content?.fields?.metadata);
      return (
        metadata.tradition &&
        metadata.tradition.toLowerCase() === faithTradition.toLowerCase()
      );
    });
  }

  // Apply tag filters
  //   if (tag) {
  //     filtered = filtered.filter((item) => {
  //       const metadata = parseMetadata(item.data?.content?.fields?.metadata);
  //       const itemTags = metadata.tags || [];
  //       return itemTags.some(
  //         (itemTag) => itemTag.toLowerCase() === tag.toLowerCase()
  //       );
  //     });
  //   }

  // Apply status filter
  if (status) {
    filtered = filtered.filter((item) => {
      const itemStatus = item.data?.content?.fields?.status;
      if (status === "answered") {
        return itemStatus === "answered";
      } else if (status === "pending") {
        return itemStatus === "pending" || !itemStatus;
      }
      return true;
    });
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.timestampMs - a.timestampMs;
      case "oldest":
        return a.timestampMs - b.timestampMs;
      case "most_votes": {
        const votesA = a.data?.content?.fields?.votes || 0;
        const votesB = b.data?.content?.fields?.votes || 0;
        return votesB - votesA;
      }
      case "most_answers": {
        const answersA = a.data?.content?.fields?.answer_count || 0;
        const answersB = b.data?.content?.fields?.answer_count || 0;
        return answersB - answersA;
      }
      default:
        return 0;
    }
  });

  return filtered;
};
