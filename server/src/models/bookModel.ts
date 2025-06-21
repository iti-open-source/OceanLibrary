import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
  {
    title: {
      type: String,
    },
    author: {
      type: String,
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
    rating: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const bookModel = mongoose.model("books", bookSchema);

export default bookModel;
