import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod/v4";
import AppError from "../utils/appError.js";

/**
 * @param schema the zod validation schema that you should have created in the utils/validation directory
 * @returns the middleware that should be applied before trying to access the controller
 */

const ZodValidator = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // tries to validate an input. If it's valid, Zod returns a strongly-typed deep clone of the input.
      const parsed = schema.parse(req.body);
      req.body = parsed; // Store validated data back to req.body
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          status: "Failure",
          message: "Validation failed",
          errors: error.issues,
        });
        return;
      }
      // Handle unexpected errors
      next(error);
    }
  };
};

export default ZodValidator;
