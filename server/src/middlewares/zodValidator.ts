import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod/v4";

/**
 * @param schema the zod validation schema that you should have created in the utils/validation directory
 * @returns the middleware that should be applied before trying to access the controller
 */

const ZodValidator = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // tries to validate an input. If it's valid, zod returns a strongly-typed deep clone of the input.
      const parsed = schema.parse(req.body);
      req.body = parsed; // store validated data back to req.body
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // TODO: implement error handling for zod errors
        res.status(400).json({
          status: "fail",
          message: `invalid ${String(error.issues[0].path.at(-1))}, ${
            error.issues[0].message
          }`,
        });
        return;
      }
      // handle unexpected errors
      next(error);
    }
  };
};

export default ZodValidator;
