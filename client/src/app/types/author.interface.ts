export interface Author {
  _id: string;
  name: string;
  bio?: string;
  nationality?: string;
  photo: string;
  genres?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthorsResponse {
  status: string;
  data: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    authors: Author[];
  };
}

export interface AuthorResponse {
  status: string;
  data: {
    author: Author;
  };
}
