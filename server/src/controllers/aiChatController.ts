import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError.js";

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
    res.status(200).json({ status: "success", message: message });
  } catch (error) {
    next(error);
  }
};
