import { Request, Response, NextFunction } from "express";
import { z } from "zod/v4";

/**
 * Middleware to parse and validate FormData fields
 * Converts string fields to appropriate types and handles arrays
 */
export const validateFormData = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse FormData fields to proper types
      const dataToValidate: Record<string, string | number | string[]> = {
        ...req.body,
      };

      // Convert string numbers to actual numbers for numeric fields
      if (dataToValidate.price && typeof dataToValidate.price === "string") {
        dataToValidate.price = parseFloat(dataToValidate.price);
      }
      if (dataToValidate.pages && typeof dataToValidate.pages === "string") {
        dataToValidate.pages = parseInt(dataToValidate.pages, 10);
      }
      if (dataToValidate.stock && typeof dataToValidate.stock === "string") {
        dataToValidate.stock = parseInt(dataToValidate.stock, 10);
      }

      // Parse genres array from FormData format (genres[0], genres[1], etc.)
      const genresArray: string[] = [];
      Object.keys(req.body).forEach((key) => {
        if (key.startsWith("genres[") && key.endsWith("]")) {
          genresArray.push(req.body[key]);
        }
      });
      if (genresArray.length > 0) {
        dataToValidate.genres = genresArray;
      }

      // Handle image validation - if there's a file, set a valid URL placeholder for validation
      if (req.file) {
        dataToValidate.image =
          "https://placeholder.com/placeholder-for-validation";
      } else if (!dataToValidate.image) {
        // If no file and no existing image URL, remove the field for optional validation
        delete dataToValidate.image;
      }

      // Validate the data structure using the provided schema
      schema.parse(dataToValidate);

      next();
    } catch (error) {
      next(error);
    }
  };
};
