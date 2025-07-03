import { z } from "zod/v4";

export const submitReviewSchema = z.object({
  bookId: z.string().regex(/^[a-f\d]{24}$/i, "invalid id"),
  rating: z.number().min(1).max(5),
  reviewTitle: z.string().min(3).max(32),
  reviewBody: z.string().min(3).max(256),
});

export const editReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  reviewTitle: z.string().min(3).max(32).optional(),
  reviewBody: z.string().min(3).max(256).optional(),
});
