import { z } from "zod/v4";

export const createAuthorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  bio: z
    .string()
    .trim()
    .max(2000, "Bio must be less than 2000 characters")
    .optional(),
  nationality: z
    .string()
    .trim()
    .max(50, "Nationality must be less than 50 characters")
    .optional(),
  photo: z.string().url("Photo must be a valid URL").optional(),
  genres: z
    .array(z.string().trim().min(1, "Genre cannot be empty"))
    .min(1, "At least one genre is required")
    .optional(),
});

export const updateAuthorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .optional(),
  bio: z
    .string()
    .trim()
    .max(2000, "Bio must be less than 2000 characters")
    .optional(),
  nationality: z
    .string()
    .trim()
    .max(50, "Nationality must be less than 50 characters")
    .optional(),
  photo: z.string().url("Photo must be a valid URL").optional(),
  genres: z
    .array(z.string().trim().min(1, "Genre cannot be empty"))
    .min(1, "At least one genre is required")
    .optional(),
});
