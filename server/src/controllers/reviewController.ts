import { Request, Response } from "express";
import reviewModel from "../models/reviewModel.js";

// Submit a new review
async function submitReview(req: Request, res: Response): Promise<void> {}

// View current submitted review
async function displayReview(req: Request, res: Response): Promise<void> {}

// Update current submitted review
async function updateReview(req: Request, res: Response): Promise<void> {}

// Delete current submitted review
async function deleteReview(req: Request, res: Response): Promise<void> {}

// Export controllers
const reviewController = {
  submitReview,
  displayReview,
  updateReview,
  deleteReview,
};
export default reviewController;
