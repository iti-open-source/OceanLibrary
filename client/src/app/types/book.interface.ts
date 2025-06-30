export interface Book {
  _id: string;
  title: string;
  authorName: string;
  authorID: string;
  genres: string[];
  price: number;
  description: string;
  stock: number;
  ratingAverage: number;
  ratingQuantity: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface BooksResponse {
  status: string;
  data: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    books: Book[];
  };
}
