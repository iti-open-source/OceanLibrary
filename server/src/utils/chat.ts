import axios from "axios";
import bookModel from "../models/bookModel.js";

export const getGeminiResponse = async (message: string): Promise<string> => {
  try {
    const books = await bookModel.find({}).limit(100);
    const bookText = books
      .slice(0, 100)
      .map((book) => `${book._id}. ${book.title} by ${book.authorName}`)
      .join("\n");

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: `based on this user prompt "${message}" Recommend mutliple books from the following list:\n\n${bookText}\n\nPlease respond with "based on your prompt here is a book that would fit you, or any friendly message and a list of Book titles one under another.`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": "AIzaSyBgIagpmQDfN3jY4vPNbOD8OS9DreP0RNM",
        },
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;

    return text || "No response from AI";
  } catch (error) {
    return `AI is not currently available, please try again later. ${error}`;
  }
};
