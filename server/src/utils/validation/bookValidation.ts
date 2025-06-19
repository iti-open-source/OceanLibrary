import Joi from "joi";

export const createBookSchema = Joi.object({
  title: Joi.string().required().trim().min(1).max(200),
  author: Joi.string().required().trim().min(1).max(100),
  genres: Joi.array().items(Joi.string().trim()).min(1).required(),
  price: Joi.number().positive().precision(2).required(),
  rating: Joi.number().min(0).max(5),
  description: Joi.string().allow("").max(1000),
  stock: Joi.number().integer().min(0).required(),
  image: Joi.string().uri().allow(""),
});
