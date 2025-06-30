import { Document, HydratedDocument } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  phone: string;
  address: {
    street: string;
    city: string;
    country: string;
    zip: string;
  };
  role: string;
  active: boolean;
  verified: boolean;
  verificationToken?: string;
  verificationExpiry?: Date;
  passwordChangeAt?: Date;
  passwordResetToken?: string;
  passwordResetExpiry?: Date;
}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
  createVerificationToken(): Promise<string>;
  createPasswordResetToken(): Promise<string>;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;
