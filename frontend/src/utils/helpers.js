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
    // Remove everything before the first '{' to clean up bad characters like \u0001
    const cleanedStr = metadataStr.slice(metadataStr.indexOf("{")).trim();
    return JSON.parse(cleanedStr);
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
        const votesA = a.data?.content?.fields?.likes || 0;
        const votesB = b.data?.content?.fields?.likes || 0;
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

// Utility function to decode Move strings
export const decodeMoveString = (moveStringArray) => {
  if (
    !moveStringArray ||
    !Array.isArray(moveStringArray) ||
    moveStringArray.length === 0
  ) {
    return "";
  }

  // In Move's string representation, the first element is the length
  // The remaining elements are the UTF-8 code points
  try {
    // Skip the first element (length) and convert the rest to characters
    return String.fromCharCode(...moveStringArray.slice(1));
  } catch (error) {
    console.error("Error decoding Move string:", error);
    return "";
  }
};

// Helper to process application details returned from the Move contract
export const processApplicationDetails = (returnValues) => {
  if (
    !returnValues ||
    !Array.isArray(returnValues) ||
    returnValues.length < 7
  ) {
    return null;
  }

  try {
    return {
      name: decodeMoveString(returnValues[0][0]),
      credentials: decodeMoveString(returnValues[1][0]),
      faithTradition: decodeMoveString(returnValues[2][0]),
      additionalInfo: decodeMoveString(returnValues[3][0]),
      status: Number(returnValues[4][0]),
      appliedAt: Number(returnValues[5][0]),
      reviewedAt: returnValues[6][0] ? Number(returnValues[6][0][0]) : null,
    };
  } catch (error) {
    console.error("Error processing application details:", error);
    return null;
  }
};
