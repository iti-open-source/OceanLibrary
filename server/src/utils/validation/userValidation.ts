import Joi from "joi";

const passwordRegex = "^[a-zA-Z0-9]{8,128}$";

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp(passwordRegex)).required(),
});

export const registerUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(32).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp(passwordRegex)).required(),
  confirm_password: Joi.string().valid(Joi.ref("password")).required(),
  phone: Joi.string().required(),
  address: {
    street: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    zip: Joi.number().required(),
  },
  role: Joi.string().valid("admin", "user"),
});

export const updateUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,50}$")).optional(),
});
