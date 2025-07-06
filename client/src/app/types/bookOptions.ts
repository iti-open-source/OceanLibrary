import { Fields, Match, SortBy } from "./queryEnums";

export interface GetBooksOptions {
  page?: number;
  limit?: number;
  search?: string;
  title?: string;
  author?: string;
  genres?: string[];
  priceMin?: number;
  priceMax?: number;
  match?: Match;
  sortBy?: SortBy;
  fields?: Fields[];
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
