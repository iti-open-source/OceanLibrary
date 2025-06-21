import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import AppError from "../utils/appError.js";

/**
 * @param schema the joi validation schema that you should have created in the utils/validation directory
 * @returns the middleware that should be applied before trying to access the controller
 */

const JoiValidator = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: true });
    if (error) {
      next(new AppError("invalid Input", 400));
    }
  };
};

export default JoiValidator;
