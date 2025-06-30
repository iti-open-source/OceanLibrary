import mongoose, { Schema } from "mongoose";
import { IBook } from "../types/entities/book.js";

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorID: {
      type: Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    genres: {
      type: [String],
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    stock: {
      type: Number,
    },
    ratingAverage: {
      type: Number,
      default: 0,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const bookModel = mongoose.model<IBook>("books", bookSchema);

export default bookModel;
