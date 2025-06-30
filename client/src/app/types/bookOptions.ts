import { Match, Order, SortBy } from "./queryEnums";

export interface GetBooksOptions {
  page?: number;
  limit?: number;
  title?: string;
  author?: string;
  priceMin?: number;
  priceMax?: number;
  match?: Match;
  order?: Order;
  sortBy?: SortBy;
}

export interface UpdateBookOptions {
  title?: string;
  authorName?: string;
  authorID?: string;
  genres?: string[];
  price?: number;
  description?: string;
  stock?: number;
  ratingAverage?: number;
  ratingQuantity?: number;
  image?: string;
}

export interface CreateBookOptions {
  title: string;
  authorName: string;
  genres: string[];
  price: number;
  description: string;
  stock: number;
  image?: string;
}
