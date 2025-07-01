import { z } from "zod/v4";

export const addToCartSchema = z.object({
  bookID: z.string().regex(/^[a-f\d]{24}$/i, {
    message: "Invalid BookID",
  }),
  quantity: z.number().int().min(1, {
    message: "Quantity must be a positive integer",
  }),
});

export const ModfiyCartSchema = z.object({
  bookID: z.string().regex(/^[a-f\d]{24}$/i, {
    message: "Invalid BookID",
  }),
  quantity: z.number().int().min(0, {
    message: "Quantity must be a positive integer",
  }),
});
