import { Router } from "express";
import { submitReview } from "../controllers/reviewController.js";
import zodValidator from "../middlewares/zodValidator.js";
import { verifyToken } from "../middlewares/auth.js";
import { submitReviewSchema } from "../utils/validation/reviewValidation.js";

const router = Router();

router.post(
  "/submit",
  zodValidator(submitReviewSchema),
  verifyToken,
  submitReview
);

export default router;
