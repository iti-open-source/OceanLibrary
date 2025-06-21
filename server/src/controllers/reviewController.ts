import { Request, Response, NextFunction } from "express";
import reviewModel from "../models/reviewModel.js";

// Submit a new review
export const submitReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {};

// View current submitted review
export const displayReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {};

// Update current submitted review
export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {};

// Delete current submitted review
export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {};
