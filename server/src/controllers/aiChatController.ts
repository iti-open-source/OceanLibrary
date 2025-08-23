import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError.js";
import { getGeminiResponse } from "../utils/chat.js";

export const chatWithAI = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { message } = req.body;

  try {
    if (!message) {
      return next(new AppError("no message found", 404));
    }
    const response = await getGeminiResponse(message);
    res.status(200).json({ status: "success", message: response });
  } catch (error) {
    next(error);
  }
};
