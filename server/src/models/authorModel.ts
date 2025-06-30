import mongoose from "mongoose";
import { IAuthor } from "../types/author.js";

const authorSchema = new mongoose.Schema<IAuthor>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    nationality: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
    },
    genres: [
      {
        type: [String],
      },
    ],
  },
  { timestamps: true }
);

const Author = mongoose.model<IAuthor>("Author", authorSchema);

export default Author;
