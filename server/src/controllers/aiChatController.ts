import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError.js";
import axios from "axios";
import bookModel from "../models/bookModel.js";

export const chatWithAi = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { message } = req.body;
  try {
    if (!message) {
      return next(new AppError("no message found", 404));
    }
    let AIResponse = await getGeminiResponse(message);
    res.status(200).json({ status: "success", message: AIResponse });
  } catch (error) {
    next(error);
  }
};

export const getGeminiResponse = async (message: string): Promise<any> => {
  try {
    const books = await bookModel.find({}).limit(100);
    const bookText = books
    .slice(0, 100)
    .map((book, idx) => `${book._id}. ${book.title} by ${book.authorName}`)
    .join("\n");

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [
          {
            parts: [
              {
                text: `based on this user prompt "${message}" Recommend a book to the user, and provide id of that book from the list below:\n\n${bookText} use the _id as bookID
                recommend mutliple books if you can, but make sure to provide the bookID for each book you recommend And title and author name of the book, and if you can provide a short description of the book, but make sure to provide the bookID for each book you recommend`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': "AIzaSyBgIagpmQDfN3jY4vPNbOD8OS9DreP0RNM",
        },
      }
    );

    const text = response.data.candidates[0].content.parts[0].text;

    return text || "No response from AI";
  } catch (error: any) {
    return "AI is not currently available, please try again later. error: " + error.message;
  }
};