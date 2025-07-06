import { z } from "zod/v4";

export const addToCartSchema = z.object({
  bookId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid BookID"),
  quantity: z.number().int().min(1, "Quantity must be a positive integer"),
});

export const modifyCartSchema = z.object({
  bookId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid BookID"),
  quantity: z.number().int().min(0, "Quantity must be a positive integer"),
});

export const mergeCartSchema = z.object({
  guestId: z
    .string()
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      "Invalid guest uuid"
    ),
});
