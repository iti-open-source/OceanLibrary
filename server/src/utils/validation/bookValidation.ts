import { z } from "zod/v4";

export const createBookSchema = z.object({
  title: z
    .string("Title is required")
    .trim()
    .min(1, "Title cannot be empty")
    .max(200, "Title must be 200 characters or less"),
  authorName: z
    .string("Author name is required")
    .trim()
    .min(1, "Author name cannot be empty")
    .max(100, "Author name must be 100 characters or less"),
  genres: z
    .array(z.string().trim().min(1, "A Genre cannot be empty"), {
      message: "Genres are required",
    })
    .min(1, "At least one genre is required"),
  price: z
    .number("Price is required")
    .positive("Price must be a positive number"),
  pages: z
    .number("Pages is required")
    .positive("Pages must be a positive number"),
  ratingAverage: z
    .number()
    .min(0, "Rating average must be at least 0")
    .max(5, "Rating average cannot exceed 5")
    .optional(),
  ratingQuantity: z
    .number()
    .int("Rating quantity must be an integer")
    .min(0, "Rating quantity cannot be negative")
    .optional(),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .optional(),
  stock: z
    .number("Stock is required")
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative"),
  image: z.url("Image must be a valid URL").optional(),
});

export const updateBookSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(200, "Title must be 200 characters or less")
    .optional(),
  authorName: z
    .string()
    .trim()
    .min(1, "Author name cannot be empty")
    .max(100, "Author name must be 100 characters or less")
    .optional(),
  genres: z
    .array(z.string().trim().min(1, "A Genre cannot be empty"))
    .min(1, "At least one genre is required")
    .optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  pages: z.number().positive("Pages must be a positive number").optional(),
  ratingAverage: z
    .number()
    .min(0, "Rating average must be at least 0")
    .max(5, "Rating average cannot exceed 5")
    .optional(),
  ratingQuantity: z
    .number()
    .int("Rating quantity must be an integer")
    .min(0, "Rating quantity cannot be negative")
    .optional(),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .optional(),
  stock: z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .optional(),
  image: z.url("Image must be a valid URL").optional(),
});
