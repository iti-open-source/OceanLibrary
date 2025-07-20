import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { UserDocument } from "../types/entities/user.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 32,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 128,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      country: String,
      zip: String,
    },
    role: {
      type: String,
      enum: ["super-admin", "admin", "user"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationExpiry: {
      type: Date,
    },
    passwordChangeAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpiry: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre(
  "save",
  async function (
    this: UserDocument,
    next: mongoose.CallbackWithoutResultAndOptionalError
  ) {
    if (!this.isModified("password")) {
      return next();
    }
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  }
);

userSchema.methods.comparePassword = async function (
  this: UserDocument,
  password: string
): Promise<boolean> {
  const user = this as UserDocument;
  return await bcrypt.compare(password, user.password).catch(() => false);
};

// verification token for email verification and password reset
userSchema.methods.generateEmailToken = async function (
  this: UserDocument,
  mode: string
): Promise<string> {
  const user = this as UserDocument;
  const token = crypto.randomBytes(32).toString("hex");
  // store hashed token in database
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  // generate token based on case required
  if (mode === "verification") {
    // token expires in 10 minutes
    user.verificationExpiry = new Date(Date.now() + 1000 * 60 * 10);
    user.verificationToken = hashedToken;
  } else if (mode === "password-reset") {
    user.passwordResetExpiry = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
    user.passwordResetToken = hashedToken;
  }
  await user.save();
  return token;
};

const userModel = mongoose.model<UserDocument>("User", userSchema);

export default userModel;
