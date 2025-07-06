import { Request, Response, NextFunction } from "express";
import Book from "../models/bookModel.js";
import AppError from "../utils/appError.js";
import Author from "../models/authorModel.js";
import {
  buildAggregationPipeline,
  countDocuments,
} from "../utils/searchHelpers.js";

/**
 * Retrieves all books with pagination, filtering, and full-text search support.
 *
 * @param req - Express request object containing query parameters:
 *   - `search` (optional): Full-text search across title, description, and author
 *   - `page` (optional): Page number for pagination (default: 1)
 *   - `limit` (optional): Number of items per page (default: 10)
 *   - `title` (optional): Title filter for case-insensitive partial match (ignored if search is used)
 *   - `author` (optional): Author filter for case-insensitive partial match (ignored if search is used)
 *   - `priceMin` (optional): Minimum price filter
 *   - `priceMax` (optional): Maximum price filter
 *   - `sortBy` (optional): The comma-separated field(s) by which to sort the books and the order to sort by (each prefexed '-' for desc) (default by ratingAverage)
 *   - `genres` (optional): The genres by which to filter the books, returns all genres if not provided
 *   - `fields` (optional): Specifies the data fields to be sent in the response (title, authorName for example)
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
 * - `searchTerm`: The search term used (only if search parameter was provided)
 *
 * @example
 * GET /books?search=gatsby&page=1&limit=10&genres=fiction,classic&priceMin=10&priceMax=50
 * Returns books matching "gatsby" with additional filters and pagination metadata
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
    search,
    title,
    author,
    priceMin,
    match = "any",
    sortBy = "-ratingAverage",
    priceMax,
    fields,
  } = req.query;

  // Parse genres from comma-separated string to array
  const genres = req.query.genres
    ? (req.query.genres as string).split(",").map((g) => g.toLowerCase())
    : undefined;

  // Calculate pagination skip value
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  try {
    // Count total documents
    const total = await countDocuments(
      search as string,
      title as string,
      author as string,
      genres,
      match as string,
      priceMin as string,
      priceMax as string
    );

    // Build and execute aggregation pipeline
    const pipeline = buildAggregationPipeline(
      search as string,
      title as string,
      author as string,
      genres,
      match as string,
      priceMin as string,
      priceMax as string,
      sortBy as string,
      fields as string,
      skip,
      parseInt(limit as string)
    );

    const books = await Book.aggregate(pipeline);

    res.status(200).json({
      status: "Success",
      data: {
        currentPage: page,
        totalPages: Math.ceil(total / parseInt(limit as string)),
        totalItems: total,
        books,
        ...(search && { searchTerm: search }),
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
    const { fields } = req.query;
    const id = req.params.id;
    // returns null if the book is not found
    const book = await Book.findById(id).select(
      fields ? (fields as string).split(",").join(" ") : "-__v"
    );
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
    // Search for the author and extract his ID
    const regex = new RegExp(req.body.authorName, "i");
    const author = await Author.findOne({ name: regex });
    if (author) {
      req.body.authorID = author?._id;
    } else {
      // if the author does not exist, create a new author with that name
      // Note: in this case the author does not yet have genres, nationality, and has a default placeholder picture
      const newAuthor = await Author.insertOne({
        name: req.body.authorName,
        bio: "This author does not have a biography yet.",
      });
      req.body.authorID = newAuthor._id;
    }
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
      return next(new AppError("Book not found", 404));
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
      return next(new AppError("Book not found", 404));
    }

    // otherwise, the book was deleted successfully
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
