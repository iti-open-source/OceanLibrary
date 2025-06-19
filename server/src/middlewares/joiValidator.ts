import { Schema } from "joi";
import { Request, Response, NextFunction } from "express";

const JoiValidator = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: true });
    if (error) {
      const err = error.details[0].message;
      return res
        .status(400)
        .json({ status: "Failure", message: "Invalid input", Errors: err });
    }
    next();
  };
};

export default JoiValidator;
