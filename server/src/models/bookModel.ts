import mongoose, { Schema } from "mongoose";
import { IBook } from "../types/entities/book.js";

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
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
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
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
      default: "https://nidcap.org/wp-content/uploads/2021/03/book.png",
    },
  },
  { timestamps: true }
);

const bookModel = mongoose.model<IBook>("books", bookSchema);

export default bookModel;
