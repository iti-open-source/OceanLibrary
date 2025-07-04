import { Request, Response, NextFunction } from "express";
import { Filter } from "bad-words";
import { CustomRequest } from "../middlewares/auth.js";
import reviewModel from "../models/reviewModel.js";
import bookModel from "../models/bookModel.js";
import userModel from "../models/userModel.js";
import AppError from "../utils/appError.js";

const filter = new Filter();

export const submitReview = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { bookId, rating, reviewTitle, reviewContent } = req.body;

  try {
    const user = await userModel.findById(req.userId);
    const book = await bookModel.findById(bookId);
    if (!user) {
      return next(new AppError("login to submit a review", 401));
    }
    if (!book) {
      return next(new AppError("book not found", 404));
    }
    // update book rating statistics
    const totalRatings = (book.ratingAverage ?? 0) * (book.ratingQuantity ?? 0);
    book.ratingQuantity = (book.ratingQuantity ?? 0) + 1;
    book.ratingAverage = (rating + totalRatings) / book.ratingQuantity;
    await book.save();
    // add review to database
    const review = await reviewModel.create({
      userId: user._id,
      bookId: bookId,
      rating: rating,
      reviewTitle: filter.clean(reviewTitle),
      reviewContent: filter.clean(reviewContent),
    });
    await review.save();
    res.status(200).json({ status: "success", data: review });
  } catch (error) {
    next(error);
  }
};

// reviews handled by user
export const getUserReviews = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reviews = await reviewModel.find({ userId: req.userId });
    if (!reviews) {
      return next(new AppError("no reviews submitted by user", 404));
    }
    res.status(200).json({ status: "success", data: reviews });
  } catch (error) {
    next(error);
  }
};

export const editReview = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  const allowed = ["rating", "reviewTitle", "reviewBody"];
  const updates: Record<string, string | number> = {};

  for (const field of allowed) {
    if (req.body[field]) {
      updates[field] = req.body[field];
    }
  }
  if (Object.keys(updates).length === 0) {
    return next(new AppError("invalid updates", 400));
  }

  try {
    const review = await reviewModel.findById(id);
    if (!review) {
      return next(new AppError("review not found", 404));
    }
    Object.assign(review, updates);
    review.edited = true;
    await review.save();
    res.status(200).json({ status: "success", data: review });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedReview = reviewModel.findByIdAndDelete(id);
    if (!deletedReview) {
      return next(new AppError("review not found", 404));
    }
    res
      .status(200)
      .json({ status: "success", message: "review deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// handle reviews as admin
export const getBookReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const reviews = reviewModel.find({ bookId: id });
    if (!reviews) {
      return next(new AppError("no reviews found", 404));
    }
    res.status(200).json({ status: "success", data: reviews });
  } catch (error) {
    next(error);
  }
};

export const removeReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedReview = reviewModel.findByIdAndDelete(id);
    if (!deletedReview) {
      return next(new AppError("review not found", 404));
    }
    res
      .status(200)
      .json({ status: "success", message: "review deleted successfully" });
  } catch (error) {
    next(error);
  }
};
