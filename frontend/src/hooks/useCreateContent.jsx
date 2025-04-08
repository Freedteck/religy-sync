import { Transaction } from "@mysten/sui/transactions";
import useSubmitTransaction from "./useSubmitTransaction";

const useCreateContent = (
  religySyncPackageId,
  platformId,
  suiClient,
  signAndExecute
) => {
  const { executeTransaction } = useSubmitTransaction(
    suiClient,
    signAndExecute
  );

  const createQuestion = async (title, details, metadata, onSuccess) => {
    const tx = new Transaction();

    // Convert metadata to string if it's an object
    const metadataStr =
      typeof metadata === "object" ? JSON.stringify(metadata) : metadata;

    tx.moveCall({
      arguments: [
        tx.object(platformId),
        tx.pure.string(title),
        tx.pure.string(details),
        tx.pure.string(metadataStr),
      ],
      target: `${religySyncPackageId}::religy_sync::create_question`,
    });

    return executeTransaction(tx, {
      successMessage: "Question submitted successfully!",
      errorMessage: "Error submitting question. Please try again.",
      loadingMessage: "Creating question...",
      onSuccess,
    });
  };

  const createAnswer = async (
    scholarCapId,
    questionId,
    title,
    content,
    metadata,
    onSuccess
  ) => {
    const tx = new Transaction();

    // Convert metadata to string if it's an object
    const metadataStr =
      typeof metadata === "object" ? JSON.stringify(metadata) : metadata;

    tx.moveCall({
      arguments: [
        tx.object(scholarCapId),
        tx.object(platformId),
        tx.object(questionId),
        tx.pure.string(title),
        tx.pure.string(content),
        tx.pure.string(metadataStr),
      ],
      target: `${religySyncPackageId}::religy_sync::create_answer`,
    });

    return executeTransaction(tx, {
      successMessage: "Answer submitted successfully!",
      errorMessage: "Error submitting answer. Please try again.",
      loadingMessage: "Submitting answer...",
      onSuccess,
    });
  };

  const applyForScholar = async (
    name,
    credential,
    tradition,
    description,
    onSuccess
  ) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(platformId),
        tx.pure.string(name || ""),
        tx.pure.string(credential || ""),
        tx.pure.string(tradition || ""),
        tx.pure.string(description || ""),
      ],
      target: `${religySyncPackageId}::religy_sync::apply_for_scholar`,
    });

    return executeTransaction(tx, {
      successMessage: "Scholar application submitted successfully!",
      errorMessage: "Error submitting application. Please try again.",
      loadingMessage: "Submitting application...",
      onSuccess,
    });
  };

  const approveScholar = async (
    adminCapId,
    scholarAddress,
    approved,
    onSuccess
  ) => {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [
        tx.object(adminCapId),
        tx.object(platformId),
        tx.pure.address(scholarAddress),
        tx.pure.bool(approved),
      ],
      target: `${religySyncPackageId}::religy_sync::review_scholar_application`,
    });

    return executeTransaction(tx, {
      successMessage: "Scholar status updated successfully!",
      errorMessage: "Error updating scholar status. Please try again.",
      loadingMessage: "Updating scholar status...",
      onSuccess,
    });
  };

  return {
    createQuestion,
    createAnswer,
    applyForScholar,
    approveScholar,
  };
};

export default useCreateContent;
