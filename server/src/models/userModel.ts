import mongoose, { Schema, Model } from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { IUser, IUserMethods, UserDocument } from "../types/user.js";

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
    active: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationExpiry: { type: Date },
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

userSchema.methods.createVerificationToken = async function (
  this: UserDocument
) {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  // store hashed token in database
  this.verificationToken = hashedToken;
  // token expires in 10 minutes
  this.verificationExpiry = new Date(Date.now() + 1000 * 60 * 10);
  await this.save();
  return token;
};

userSchema.methods.createPasswordResetToken = async function (
  this: UserDocument
) {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  this.passwordResetToken = hashedToken;
  this.passwordResetExpiry = new Date(Date.now() + 1000 * 60 * 10);
  await this.save();
  return token;
};

const userModel = mongoose.model<IUser, Model<IUser, {}, IUserMethods>>(
  "users",
  userSchema
);

export default userModel;
