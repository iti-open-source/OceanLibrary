import { Fields, Match, SortBy } from "./queryEnums";

export interface GetAuthorsOptions {
  page?: number;
  limit?: number;
  name?: string;
  nationality?: string;
  genres?: string[];
  match?: Match;
  sortBy?: SortBy;
  sortOrder?: "asc" | "desc";
  fields?: Fields[];
}

export interface CreateAuthorOptions {
  name: string;
  bio?: string;
  nationality?: string;
  photo?: File;
  genres?: string[];
}

export interface UpdateAuthorOptions {
  name?: string;
  bio?: string;
  nationality?: string;
  photo?: File;
  genres?: string[];
}
