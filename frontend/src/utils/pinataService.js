import toast from "react-hot-toast";
import { pinataConfig } from "../config/pinataConfig";

export const uploadToPinata = async (file) => {
  const gatewayUrl = import.meta.env.VITE_PINATA_GATEWAY_URL;
  if (!file) {
    throw new Error("No file provided");
  }
  const toastId = toast.loading(`Uploading ${file.name}...`);

  try {
    const fileData = await pinataConfig.upload.public.file(file);
    const fileCid = fileData.cid;
    const fileUrl = `https://${gatewayUrl}/ipfs/${fileCid}`;
    toast.success(`Uploaded ${file.name} successfully!`, { id: toastId });
    return fileUrl;
  } catch (error) {
    toast.error(`Failed to upload ${file.name}: ${error.message}`, {
      id: toastId,
    });
    throw error;
  }
};

export const uploadMultiple = async (files) => {
  const gatewayUrl = import.meta.env.VITE_PINATA_GATEWAY_URL;
  if (!files || files.length === 0) {
    throw new Error("No files provided");
  }
  const toastId = toast.loading(`Uploading ${files.length} files...`);
  try {
    const uploadPromises = files.map((file) =>
      pinataConfig.upload.public.file(file)
    );
    const fileDataArray = await Promise.all(uploadPromises);
    const fileUrls = fileDataArray.map((fileData) => {
      const fileCid = fileData.cid;
      return `https://${gatewayUrl}/ipfs/${fileCid}`;
    });
    toast.success(`Uploaded ${files.length} files successfully!`, {
      id: toastId,
    });
    return fileUrls;
  } catch (error) {
    toast.error(`Failed to upload files: ${error.message}`, { id: toastId });
    throw error;
  }
};
