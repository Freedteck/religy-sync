import toast from "react-hot-toast";

const WALRUS_PUBLISHER_URL = "https://publisher.walrus-testnet.walrus.space";
const WALRUS_AGGREGATOR_URL = "https://aggregator.walrus-testnet.walrus.space";

export const uploadToWalrus = async (file, sendToAddress = "") => {
  if (!file) {
    throw new Error("No file provided");
  }

  const toastId = toast.loading(`Uploading ${file.name}...`);

  try {
    const numEpochs = 1; // You can make this configurable if needed
    const sendToParam = sendToAddress ? `&send_object_to=${sendToAddress}` : "";

    const response = await fetch(
      `${WALRUS_PUBLISHER_URL}/v1/blobs?epochs=${numEpochs}${sendToParam}`,
      {
        method: "PUT",
        body: file,
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to upload file to Walrus");
    }

    const data = await response.json();

    let blobId;
    if ("alreadyCertified" in data) {
      blobId = data.alreadyCertified.blobId;
    } else if ("newlyCreated" in data) {
      blobId = data.newlyCreated.blobObject.blobId;
    } else {
      throw new Error("Unexpected response format from Walrus");
    }

    const blobUrl = `${WALRUS_AGGREGATOR_URL}/v1/blobs/${blobId}`;

    toast.success(`Uploaded ${file.name} successfully!`, { id: toastId });
    return blobUrl;
  } catch (error) {
    toast.error(`Failed to upload ${file.name}: ${error.message}`, {
      id: toastId,
    });
    throw error;
  }
};

export const uploadMultipleToWalrus = async (files, sendToAddress = "") => {
  const uploadPromises = files.map((file) =>
    uploadToWalrus(file, sendToAddress)
  );
  return await Promise.all(uploadPromises);
};
