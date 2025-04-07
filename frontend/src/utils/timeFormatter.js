export const formatTime = (timestamp) => {
  const date = new Date(Number(timestamp)); // Convert seconds to milliseconds
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};
