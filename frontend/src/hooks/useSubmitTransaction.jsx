import toast from "react-hot-toast";

const useSubmitTransaction = (suiClient, signAndExecute) => {
  const executeTransaction = async (
    tx,
    {
      onSuccess = () => {},
      onError = () => {},
      successMessage = "Transaction successful!",
      errorMessage = "Transaction failed. Please try again.",
      loadingMessage = "Processing transaction...",
    }
  ) => {
    // Create a loading toast that we can dismiss later
    const loadingToastId = toast.loading(loadingMessage);

    return signAndExecute(
      { transaction: tx },
      {
        onSuccess: async ({ digest }) => {
          try {
            const result = await suiClient.waitForTransaction({
              digest: digest,
              options: { showEffects: true },
            });

            // Dismiss the loading toast and show success
            toast.dismiss(loadingToastId);
            toast.success(successMessage);

            onSuccess(result);
          } catch (error) {
            // Dismiss the loading toast and show error
            toast.dismiss(loadingToastId);
            toast.error(
              "Error verifying transaction. Please check your network."
            );
            console.error("Transaction verification error:", error);
          }
        },
        onError: (error) => {
          // Dismiss the loading toast and show error
          toast.dismiss(loadingToastId);
          toast.error(errorMessage);
          console.error("Transaction error:", error);

          onError(error);
        },
      }
    );
  };

  return { executeTransaction };
};

export default useSubmitTransaction;
