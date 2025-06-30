import mongoose from "mongoose";
import { IAuthor } from "../types/entities/author.js";

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
      default:
        "https://images.assetsdelivery.com/compings_v2/apoev/apoev1811/apoev181100196.jpg",
    },
    genres: {
      type: [String],
    },
  },
  { timestamps: true }
);

const Author = mongoose.model<IAuthor>("Author", authorSchema);

export default Author;
