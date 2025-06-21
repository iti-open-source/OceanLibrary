import Joi from "joi";

export const registerUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("/^[ -~]{8,50}$/")).required(),
  confirm_password: Joi.any().valid(Joi.ref("password")).required(),
});

export const updateUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,50}$")).optional(),
});
