import { Request, Response, NextFunction } from "express";
import Book from "../models/bookModel.js";
import AppError from "../utils/appError.js";
import { BookFilter } from "../types/filters/bookFilter.js";

/**
 * Retrieves all books with pagination and filtering support.
 *
 * @param req - Express request object containing query parameters:
 *   - `page` (optional): Page number for pagination (default: 1)
 *   - `limit` (optional): Number of items per page (default: 10)
 *   - `title` (optional): Title filter for case-insensitive partial match
 *   - `author` (optional): Author filter for case-insensitive partial match
 *   - `priceMin` (optional): Minimum price filter
 *   - `priceMax` (optional): Maximum price filter
 *   - `sortBy` (optional): The field by which to sort the books (default by ratingAverage)
 *   - `order` (asc/desc) (optional): The order of the sorting (Descending or ascending) (default descending)
 *   - `genres` (optional): The genres by which to filter the books, returns all genres if not provided
 *   - `match` (any/all) (optional): Specifies whether we want the book to have at least one of the genres to pass or all of them
 * @param res - Express response object
 * @param next - Express next function for error handling
 * @returns Promise<void> - Responds with paginated and filtered book data or error message
 *
 * @remarks
 * The response includes:
 * - `currentPage`: Current page number
 * - `totalPages`: Total number of pages
 * - `totalItems`: Total number of books matching the filter criteria
 * - `data`: Array of books for the current page
 *
 * @example
 * GET /books?page=1&limit=10&title=javascript&author=smith&priceMin=10&priceMax=50
 * Returns filtered books with pagination metadata
 *
 * @throws {500} When database operation fails
 */

export const getAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    page = 1,
    limit = 10,
    title,
    author,
    priceMin,
    match = "any",
    sortBy = "ratingAverage",
    order = "desc",
    priceMax,
  } = req.query;

  // Genres are expected to be a comma-separated string, so we convert it to an array here and make sure that they're all lower case
  const genres = req.query.genres
    ? (req.query.genres as string).split(",").map((g) => g.toLowerCase())
    : undefined;

  // ex: If we're on page 1 and the limit is 10 -> (1 - 1) * 10 = 0, which is correct we don't wanna skip anything in this case
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  // Build filter object
  const filter: BookFilter = {};

  // Check for each filter item, if it exists, apply it to the filter object
  if (title) {
    filter.title = { $regex: title as string, $options: "i" }; // case-insensitive partial match
  }

  if (author) {
    filter.authorName = { $regex: author as string, $options: "i" }; // case-insensitive partial match
  }

  if (genres) {
    if (match == "any") {
      // if the match is 'any' , then that means we want the 'UNION', which means we want the books having 'ANY' of these genres
      // so a book having at least one of the genres will pass
      filter.genres = { $in: genres };
    } else if (match == "all") {
      // but if the match is 'all', then that means we want the 'INTERSECTION', which means we want the books having 'ALL' of these genres
      // so the book must have all of the provided genres to pass
      filter.genres = { $all: genres };
    }
  }

  if (priceMin || priceMax) {
    filter.price = {};
    if (priceMin) {
      filter.price.$gte = parseFloat(priceMin as string);
    }
    if (priceMax) {
      filter.price.$lte = parseFloat(priceMax as string);
    }
  }

  try {
    const books = await Book.find(filter)
      // You can sort by price, title, ratingAverage, ratingQuantity, stock, ..etc
      .sort({ [sortBy as string]: order == "asc" ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit as string));
    const total = await Book.countDocuments(filter);

    res.status(200).json({
      status: "Success",
      data: {
        currentPage: page,
        totalPages: Math.ceil(total / parseInt(limit as string)),
        totalItems: total,
        books,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a book by its ID from the database.
 *
 * @param req - Express request object containing the book ID in params
 * @param res - Express response object used to send the book data
 * @param next - Express next function for error handling
 * @returns Promise<void> - Resolves when the operation completes
 *
 * @throws {AppError} When book with the specified ID is not found (404)
 * @throws {Error} When database operation fails or other unexpected errors occur by passing that error to the global error handler
 *
 * @example
 * ```
 *  GET /books/685aa1b8da2b1ae66352b270
 *  Response on success:
 * {
 *   "status": "Success",
 *   "data": {
 *     "_id": "685aa1b8da2b1ae66352b270",
 *     "title": "Book Title",
 *      ... other book properties
 *   }
 * }
 * ```
 */
export const getBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    // returns null if the book is not found
    const book = await Book.findById(id);
    // check for null
    if (!book) {
      next(new AppError("Book Not Found", 404));
    } else {
      res.json({
        status: "Success",
        data: {
          book,
        },
      });
    }
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
    const book = await Book.insertOne(req.body);
    res.status(201).json({
      status: "Success",
      message: "Book created successfully",
      data: {
        book,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Updates a book by its ID with the provided data in the request body.
 *
 * @param req - Express request object containing the book ID in params and update data in body
 * @param res - Express response object used to send the updated book data
 * @param next - Express next function for error handling middleware
 * @returns Promise<void> - Resolves when the book is successfully updated and response is sent
 *
 * @throws {AppError} Throws an AppError with status 404 if no book is found with the given ID
 *
 * @example
 *  PATCH /api/books/123
 *  Request body: { title: "New Title", author: "New Author" }
 *  Response: { status: "Success", message: "Book updated successfully", data: { book: {...} } }
 */
export const updateBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    // if the updatedBook is null, that means there are no books with that id
    if (!updatedBook) {
      throw new AppError("Book not found", 404);
    }
    // otherwise, the book was updated successfully
    res.status(200).json({
      status: "Success",
      message: "Book updated successfully",
      data: {
        book: updatedBook,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a book by its ID from the database.
 *
 * @param req - Express request object containing the book ID in params
 * @param res - Express response object used to send the HTTP response
 * @param next - Express next function for error handling middleware
 *
 * @throws {AppError} Throws an AppError with status 404 if no book is found with the given ID
 *
 * @returns Promise<void> - Returns a promise that resolves when the operation completes
 *
 * @remarks
 * - Expects the book ID to be provided in the request parameters as 'id'
 * - Returns HTTP 204 (No Content) status on successful deletion
 * - Uses Mongoose's findByIdAndDelete method to remove the book from the database
 * - Passes any caught errors to the error handling middleware via next()
 */
export const deleteBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const deletedBook = await Book.findByIdAndDelete(id);

    // if the deletedBook is null, that means there are no books with that id
    if (!deletedBook) {
      throw new AppError("Book not found", 404);
    }

    // otherwise, the book was deleted successfully
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
