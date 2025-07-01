import { z } from "zod/v4";

export const createBookSchema = z.object({
  title: z.string().trim().min(1).max(200),
  authorName: z.string().trim().min(1).max(100),
  genres: z.array(z.string().trim()).min(1),
  price: z.number().positive(),
  pages: z.number().positive(),
  ratingAverage: z.number().min(0).max(5).optional(),
  ratingQuantity: z.number().int().min(0).optional(),
  description: z.string().max(1000).optional(),
  stock: z.number().int().min(0),
  image: z.string().url().optional(),
});

export const updateBookSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  authorName: z.string().trim().min(1).max(100).optional(),
  genres: z.array(z.string().trim()).min(1).optional(),
  price: z.number().positive().optional(),
  pages: z.number().positive().optional(),
  ratingAverage: z.number().min(0).max(5).optional(),
  ratingQuantity: z.number().int().min(0).optional(),
  description: z.string().max(1000).optional(),
  stock: z.number().int().min(0).optional(),
  image: z.string().url().optional(),
});
