import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({});

export async function generateChatResponse(coversationHistory) {
  const formattedConvo = coversationHistory
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              "Continue this conversation naturally as an AI assistant:\n\n" +
              formattedConvo,
          },
        ],
      },
    ],
  });

  return response.text;
}
export async function generateChatTitle(firstUserMessage) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Generate ONLY a short 2-5 word title for this chat. Do not include any asterisks, quotes, punctuation, or explanations. Just respond with the title itself, nothing else.
                    User's message: "${firstUserMessage}"

Title:`,
          },
        ],
      },
    ],
  });

  // Cleaning up the response - removing asterisks, quotes, extra whitespace
  let title = response.text.trim();
  title = title.replace(/[\*\"\']/g, ""); // Removed *, ", '
  title = title.replace(/^Title:\s*/i, ""); // Removed "Title:" prefix if present
  title = title.trim();

  // just in case If it is still too long, we perform truncate :) 
  if (title.length > 50) {
    title = title.substring(0, 50) + "...";
  }

  return title;
}
