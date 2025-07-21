import { HydratedDocument } from "mongoose";

export interface IAuthor {
  name: string;
  bio: string;
  nationality: string;
  photo: string;
  genres: string[];
}

export type AuthorDocument = HydratedDocument<IAuthor>;
