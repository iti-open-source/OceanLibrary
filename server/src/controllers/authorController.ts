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
  const {
    page = 1,
    limit = 10,
    name,
    nationality,
    match = "any",
    fields,
    sortBy = "name",
    sortOrder = "asc",
  } = req.query;

  const genres = req.query.genres
    ? (req.query.genres as string).split(",").map((g) => g.toLowerCase())
    : undefined;

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

  if (page) {
    const numOfAuthors = await Author.countDocuments();
    if (skip >= numOfAuthors)
      next(new AppError("This page does not exist", 404));
  }

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
    // Create sort object
    const sortObject: Record<string, 1 | -1> = {};
    const validSortFields = ["name", "nationality", "createdAt"];
    const sortField = validSortFields.includes(sortBy as string)
      ? sortBy
      : "name";
    const order = sortOrder === "desc" ? -1 : 1;
    sortObject[sortField as string] = order;

    const authors = await Author.find(filter)
      .select(fields ? (fields as string).replaceAll(",", " ") : "-__v")
      .sort(sortObject)
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
    const { fields } = req.query;
    const author = await Author.findById(id).select(
      fields ? (fields as string).replaceAll(",", " ") : "-__v"
    );
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
      return next(new AppError("Author not found", 404));
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
      return next(new AppError("Author not found", 404));
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
