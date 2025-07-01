import { IBook } from "./book.js";

interface cIBook extends IBook {
  _id: string;
}

export interface ICartItem {
  bookId: string;
  title: string;
  price: number;
  stock: number;
  image: string;
  quantity: number;
  subtotal: number;
}

export interface ICart {
  items: ICartItem[];
  total: number;
}

export interface IRefBook {
  bookId: cIBook;
  quantity: number;
}
