import { Request, Response, NextFunction } from "express";
import Book from "../models/bookModel.js";

/**
 * Retrieves all books with pagination support.
 *
 * @param req - Express request object containing query parameters:
 *   - `page` (optional): Page number for pagination (default: 1)
 *   - `limit` (optional): Number of items per page (default: 10)
 * @param res - Express response object
 * @returns Promise<void> - Responds with paginated book data or error message
 *
 * @remarks
 * The response includes:
 * - `currentPage`: Current page number
 * - `totalPages`: Total number of pages
 * - `totalItems`: Total number of books in the database
 * - `data`: Array of books for the current page
 *
 * @example
 * GET /books?page=2&limit=5
 * Returns books 6-10 with pagination metadata
 *
 * @throws {500} When database operation fails
 */
export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const defaultPageNumber = 1;
  const defautlLimitNumber = 10;
  const page = parseInt(req.query.page as string) || defaultPageNumber;
  const limit = parseInt(req.query.limit as string) || defautlLimitNumber;

  // ex: If we're on page 1 and the limit is 10 -> (1 - 1) * 10 = 0, which is correct we don't wanna skip anything in this case
  const skip = (page - 1) * limit;

  try {
    const books = await Book.find().skip(skip).limit(limit);
    const total = await Book.countDocuments();

    res.json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Creates a new book in the database.
 * @param req - Express request object, which contains the needed data in the body
 * @param res - Express response object
 * @returns Promise<void> - Responds with 201 status and book data on success, or 500 status on error
 *
 * @throws Will return a 500 status code with error details if book creation fails
 */
export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      author,
      genres,
      price,
      rating = 0,
      description,
      stock,
      image,
    } = req.body;

    const book = await Book.insertOne({
      title,
      author,
      genres,
      price,
      rating,
      description,
      stock,
      image,
    });
    res.status(201).json({
      status: "Success",
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};
