import { Request, Response } from "express";
import Book from "../models/bookModel.js";
import { create } from "domain";

const getAllBooks = async (req: Request, res: Response): Promise<void> => {
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
    res
      .status(500)
      .json({ status: "Failure", message: "Something went wrong", error });
  }
};

const createBook = async (req: Request, res: Response): Promise<void> => {
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
    res.status(500).json({
      status: "Failure",
      message: "Something went wrong",
      error,
    });
  }
};

export default { createBook, getAllBooks };
