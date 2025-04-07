import { Transaction } from "@mysten/sui/transactions";
import { redirect } from "react-router-dom";

export const askQuestionAction = async ({ request }) => {
  // Get the form data
  const formData = await request.formData();

  const title = formData.get("title");
  const details = formData.get("details");
  const tradition = formData.get("tradition");
  const preferredScholar = formData.get("preferredScholar");
  const tokenAmount = parseFloat(formData.get("tokenAmount")) || 0;

  const tagsString = formData.get("tags");
  const tags = tagsString ? tagsString.split(",") : [];

  console.log("title", title);
  console.log("details", details);
  console.log("tradition", tradition);
  console.log("preferredScholar", preferredScholar);
  console.log("tokenAmount", tokenAmount);
  console.log("tags", tags);
};
