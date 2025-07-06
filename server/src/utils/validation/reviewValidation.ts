import { z } from "zod/v4";

export const submitReviewSchema = z.object({
  bookId: z.string().regex(/^[a-f\d]{24}$/i, "invalid id"),
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Minimum rating is 1 star")
    .max(5, "Maximum rating is 5 stars"),
  reviewTitle: z
    .string()
    .min(3, "Minimum review title is 3 characters")
    .max(32, "Maximum review title is 32 characters"),
  reviewContent: z
    .string()
    .min(3, "Reviews cannot be less than 3 characters")
    .max(256, "Reviews cannot exceed 256 characters"),
});

export const editReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  reviewTitle: z.string().min(3).max(32).optional(),
  reviewContent: z.string().min(3).max(256).optional(),
});
