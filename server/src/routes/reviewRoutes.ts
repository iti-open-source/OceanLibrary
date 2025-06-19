import { Router } from "express";
import reviewController from "../controllers/reviewController.js";

const reviewRouter = Router();

// View reviews
reviewRouter.get("/", reviewController.displayReview);

// Create a new review
reviewRouter.post("/", reviewController.submitReview);

// Update current review
reviewRouter.patch("/", reviewController.updateReview);

// Delete current review
reviewRouter.delete("/", reviewController.deleteReview);

// Export router
export default reviewRouter;
