import { Schema } from "joi";
import { Request, Response, NextFunction } from "express";

/**
 *
 * @param schema the joi validation schema that you should have created in the utils/validation directory
 * @returns the middleware that should be applied before trying to access the controller
 */

const JoiValidator = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: true });
    if (error) {
      const err = error.details[0].message;
      res
        .status(400)
        .json({ status: "Failure", message: "Invalid input", Errors: err });
      return;
    }
    next();
  };
};

export default JoiValidator;
