import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../middlewares/auth.js";
import reviewModel from "../models/reviewModel.js";
import userModel from "../models/userModel.js";
import AppError from "../utils/appError.js";

// View current submitted review
export const getReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reviews = await reviewModel.find();
    res.status(200).json({ status: "success", data: reviews });
  } catch (error) {
    next(error);
  }
};

// Submit a new review
export const submitReview = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { bookId, rating, comment } = req.body;

  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return next(new AppError("login to submit a review", 401));
    }
    const review = await reviewModel.create({
      userId: user._id,
      bookId: bookId,
      username: user.username,
      rating: rating,
      comment: comment,
    });
    await review.save();
    res.status(200).json({ status: "success", data: review });
  } catch (error) {
    next(error);
  }
};

// Update current submitted review
export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
  } catch (error) {
    next(error);
  }
};

// Delete current submitted review
export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
  } catch (error) {
    next(error);
  }
};
