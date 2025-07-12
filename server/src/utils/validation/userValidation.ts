import { z } from "zod/v4";
import validator from "validator";

const usernameRegex = new RegExp("^[a-zA-Z0-9]+$");
/**
 * 1. At least 8 characters long (`.{8,}`).
 * 2. Contains at least one uppercase letter (`(?=.*[A-Z])`).
 * 3. Contains at least one lowercase letter (`(?=.*[a-z])`).
 * 4. Contains at least one digit (`(?=.*\d)`).
 * 5. Contains at least one special character (`(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-])`).
 */
const passwordRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\\\-])[A-Za-z\\d!@#$%^&*()_+{}\\[\\]:;<>,.?~\\\\-]{8,}$"
);
const zipRegex = new RegExp("^\\d{5}(?:[-\\s]\\d{4})?$");

export const loginUserSchema = z.object({
  email: z.email().trim(),
  password: z
    .string()
    .regex(passwordRegex, "Password must be alphanumeric")
    .min(8, "Passwords cannot be less than 8 characters long")
    .max(128, "Password limit exceeded"),
});

export const registerUserSchema = z
  .object({
    username: z
      .string()
      .min(3, "Usernames cannot be less than 3 characters long")
      .max(32, "Usernames cannot exceed 32 characters")
      .trim()
      .regex(usernameRegex, "Only alphanumeric characters allowed"),
    email: z.email().trim(),
    password: z
      .string()
      .regex(passwordRegex, "Password must be alphanumeric xxx")
      .min(8, "Passwords cannot be less than 8 characters long")
      .max(128, "Password limit exceeded"),
    confirmPassword: z.string(),
    phone: z
      .string()
      .refine((phone) => validator.isMobilePhone(phone, "ar-EG"), {
        message: "Invalid egyptian phone number",
      }),
    address: z.object({
      street: z.string().max(128).trim(),
      city: z.string().max(32).trim(),
      country: z.string().max(32).trim(),
      zip: z.string().regex(zipRegex, "Invalid zip").min(5).max(10).trim(),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateUserSchema = z.object({
  username: z
    .string()
    .min(3, "Usernames cannot be less than 3 characters long")
    .max(32, "Usernames cannot exceed 32 characters")
    .trim()
    .regex(usernameRegex, "Only alphanumeric characters allowed")
    .optional(),
  email: z.email().trim().optional(),
  phone: z
    .string()
    .refine((phone) => validator.isMobilePhone(phone, "ar-EG"), {
      message: "Invalid Egyptian phone number",
    })
    .optional(),
  address: z
    .object({
      street: z.string().max(128).trim().optional(),
      city: z.string().max(32).trim().optional(),
      country: z.string().max(32).trim().optional(),
      zip: z
        .string()
        .regex(zipRegex, "Invalid zip")
        .min(5)
        .max(10)
        .trim()
        .optional(),
    })
    .optional(),
});

export const changePasswordSchema = z
  .object({
    password: z
      .string()
      .regex(passwordRegex, "Password must be alphanumeric")
      .min(8, "Passwords cannot be less than 8 characters long")
      .max(128, "Password limit exceeded"),
    newPassword: z
      .string()
      .regex(passwordRegex, "Password must be alphanumeric")
      .min(8, "Passwords cannot be less than 8 characters long")
      .max(128, "Password limit exceeded"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .regex(passwordRegex, "Password must be alphanumeric")
      .min(8, "Passwords cannot be less than 8 characters long")
      .max(128, "Password limit exceeded"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
