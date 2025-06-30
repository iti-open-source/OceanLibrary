import { Request, Response, NextFunction } from "express";
import Author from "../models/authorModel.js";
import AppError from "../utils/appError.js";
import { AuthorFilter } from "../types/filters/authorFilter.js";

/**
 * Get all authors with pagination and filtering
 */
export const getAllAuthors = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { page = 1, limit = 10, name, nationality, match = "any" } = req.query;

  const genres = req.query.genres
    ? (req.query.genres as string).split(",").map((g) => g.toLowerCase())
    : undefined;

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  const filter: AuthorFilter = {};

  if (name) {
    filter.name = { $regex: name as string, $options: "i" };
  }

  if (nationality) {
    filter.nationality = { $regex: nationality as string, $options: "i" };
  }

  if (genres) {
    if (match == "any") {
      filter.genres = { $in: genres };
    } else if (match == "all") {
      filter.genres = { $all: genres };
    }
  }

  try {
    const authors = await Author.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit as string));
    const total = await Author.countDocuments(filter);

    res.status(200).json({
      status: "Success",
      data: {
        currentPage: page,
        totalPages: Math.ceil(total / parseInt(limit as string)),
        totalItems: total,
        authors,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get author by ID
 */
export const getAuthorById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const author = await Author.findById(id);
    if (!author) {
      next(new AppError("Author Not Found", 404));
    } else {
      res.json({
        status: "Success",
        data: {
          author,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Create new author
 */
export const createAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const author = await Author.create(req.body);
    res.status(201).json({
      status: "Success",
      message: "Author created successfully",
      data: {
        author,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update author by ID
 */
export const updateAuthorById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const updatedAuthor = await Author.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedAuthor) {
      throw new AppError("Author not found", 404);
    }
    res.status(200).json({
      status: "Success",
      message: "Author updated successfully",
      data: {
        author: updatedAuthor,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete author by ID
 */
export const deleteAuthorById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    const deletedAuthor = await Author.findByIdAndDelete(id);

    if (!deletedAuthor) {
      throw new AppError("Author not found", 404);
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
