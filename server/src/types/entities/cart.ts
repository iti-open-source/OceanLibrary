import mongoose from "mongoose";

export interface cartItem {
  bookId: mongoose.Types.ObjectId;
  title: string;
  price: number;
  stock: number;
  image: string;
  quantity: number;
  subtotal: number;
}

export interface userCart {
  items: cartItem[];
  total: number;
}
