import mongoose, { Document, Schema, Model, HydratedDocument } from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";

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
  verified?: boolean;
  active?: boolean;
  passwordChangeAt?: Date;
  passwordResetToken?: string;
  passwordResetExpiry?: Date;
}

export interface IUserMethods {
  createPasswordResetToken(): Promise<string>;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;

const userSchema = new Schema<
  IUser,
  Model<IUser, {}, IUserMethods>,
  IUserMethods
>(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8, maxlength: 128 },
    phone: { type: String, required: true, trim: true },
    address: { street: String, city: String, country: String, zip: String },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    verified: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    passwordChangeAt: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpiry: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (this: UserDocument, next) {
  if (!this.isModified("password")) {
    return next();
  }
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.createPasswordResetToken = async function (
  this: UserDocument
) {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  // store hashed password in database
  this.passwordResetToken = hashedToken;
  // password expires in 10 minutes
  this.passwordResetExpiry = new Date(Date.now() + 1000 * 60 * 10);
  await this.save();
  return token;
};

const userModel = mongoose.model<IUser, Model<IUser, {}, IUserMethods>>(
  "users",
  userSchema
);

export default userModel;
