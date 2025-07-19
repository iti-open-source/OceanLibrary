import { Request, Response, NextFunction } from "express";
import path from "path";
import crypto from "crypto";

/**
 * Middleware to process and save uploaded images to disk
 * Should be used after validation to ensure the image is only saved if data is valid
 */
export const processImageFile = (
  uploadDir: string = "uploads/books/",
  fieldName: string = "image"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // If validation passed and we have a file, save it to disk
      if (req.file) {
        const uniqueName = `${crypto.randomUUID()}${path.extname(
          req.file.originalname
        )}`;
        const filePath = path.join(uploadDir, uniqueName);

        // Save file to disk
        const fs = await import("fs/promises");
        await fs.writeFile(filePath, req.file.buffer);

        // Create the image URL and add it to the request body
        const cleanUploadDir = uploadDir.replace(/\/$/, ""); // Remove trailing slash
        const imageUrl = `${req.protocol}://${req.get(
          "host"
        )}/${cleanUploadDir}/${uniqueName}`;
        req.body[fieldName] = imageUrl;
      }

      next();
    } catch (error) {
      // If there was an error saving the file, pass it to error handler
      next(error);
    }
  };
};
