import { Router } from "express";
import {
  getUserReviews,
  submitReview,
  editReview,
  deleteReview,
  getBookReviews,
  removeReview
} from "../controllers/reviewController.js";
import zodValidator from "../middlewares/zodValidator.js";
import { verifyAdmin, verifyToken } from "../middlewares/auth.js";
import { submitReviewSchema } from "../utils/validation/reviewValidation.js";

const router = Router();

router.get("/userReviews", verifyToken, getUserReviews);
router.post("/", zodValidator(submitReviewSchema), verifyToken, submitReview);
router.patch("/:id", verifyToken, editReview);
router.delete("/:id", verifyToken, deleteReview);
// admin routes
router.get("/bookReviews/:id", verifyToken, verifyAdmin, getBookReviews);
router.delete("/remove/:id", verifyToken, verifyAdmin, removeReview);

export default router;
