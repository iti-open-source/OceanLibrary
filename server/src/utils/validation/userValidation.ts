import BaseJoi from "joi";
import JoiPhoneNumber from "joi-phone-number";

const Joi = BaseJoi.extend(JoiPhoneNumber);
const passwordRegex = /^[a-zA-Z0-9]+$/;
const zipRegex = /^\d+$/;

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp(passwordRegex)).required(),
});

export const registerUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(32).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp(passwordRegex))
    .min(8)
    .max(128)
    .required(),
  confirm_password: Joi.ref("password"),
  phone: Joi.string()
    .phoneNumber({ defaultCountry: "EG", strict: true })
    .required(),
  address: {
    street: Joi.string().max(128).required(),
    city: Joi.string().max(32).required(),
    country: Joi.string().max(32).required(),
    zip: Joi.string().pattern(new RegExp(zipRegex)).min(5).max(10).required(),
  },
  role: Joi.string().valid("admin", "user"),
});

export const updateUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(32).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string()
    .pattern(new RegExp(passwordRegex))
    .min(8)
    .max(128)
    .optional(),
  phone: Joi.string()
    .phoneNumber({ defaultCountry: "EG", strict: true })
    .optional(),
  address: {
    street: Joi.string().max(128).optional(),
    city: Joi.string().max(32).optional(),
    country: Joi.string().max(32).optional(),
    zip: Joi.string().pattern(new RegExp(zipRegex)).min(5).max(10).optional(),
  },
});
