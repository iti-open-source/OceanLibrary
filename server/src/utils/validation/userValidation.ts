import { z } from "zod/v4";
import validator from "validator";

const passwordRegex = /^[a-zA-Z0-9]+$/;
const zipRegex = /^\d+$/;

export const loginUserSchema = z.object({
  email: z.email().trim(),
  password: z.string().regex(passwordRegex, "password must be alphanumeric"),
});

export const registerUserSchema = z
  .object({
    username: z
      .string()
      .min(3)
      .max(32)
      .trim()
      .regex(/^[a-zA-Z0-9]*$/, "only alphanumeric characters allowed"),
    email: z.email().trim(),
    password: z
      .string()
      .regex(passwordRegex, "password must be alphanumeric")
      .min(8)
      .max(128),
    confirm_password: z.string(),
    phone: z.string().refine(validator.isMobilePhone),
    address: z.object({
      street: z.string().max(128),
      city: z.string().max(32),
      country: z.string().max(32),
      zip: z.string().regex(zipRegex, "invalid zip").min(5).max(10),
    }),
    role: z.enum(["admin", "user"]).optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "passwords do not match",
    path: ["confirm_password"],
  });

export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(32)
    .trim()
    .regex(/^[a-zA-Z0-9]*$/, "only alphanumeric characters allowed")
    .optional(),
  email: z.email().trim().optional(),
  password: z
    .string()
    .regex(passwordRegex, "password must be alphanumeric")
    .min(8)
    .max(128)
    .optional(),
  phone: z.string().refine(validator.isMobilePhone).optional(),
  address: z
    .object({
      street: z.string().max(128).optional(),
      city: z.string().max(32).optional(),
      country: z.string().max(32).optional(),
      zip: z.string().regex(zipRegex, "invalid zip").min(5).max(10).optional(),
    })
    .optional(),
});
