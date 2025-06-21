import { Router } from "express";
import {
  displayReview,
  submitReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

const router = Router();

router.get("/", displayReview);
router.post("/", submitReview);
router.patch("/", updateReview);
router.delete("/", deleteReview);

export default router;
