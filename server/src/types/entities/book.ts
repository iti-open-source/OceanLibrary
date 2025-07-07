import mongoose from "mongoose";

export interface IBook {
  title: string;
  authorName: string;
  authorID: mongoose.Types.ObjectId;
  genres: string[];
  price: number;
  pages: number;
  description: string;
  stock: number;
  ratingAverage?: number;
  ratingQuantity?: number;
  image: string;
}
