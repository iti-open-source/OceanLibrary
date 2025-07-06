import { Document, HydratedDocument } from "mongoose";

export interface IAuthor extends Document {
  name: string;
  bio: string;
  nationality: string;
  photo: string;
  genres: string[];
}

export type AuthorDocument = HydratedDocument<IAuthor>;
