import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 128,
    },
    phone: {
      type: String,
      required: true,
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
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre(
  "save",
  async function (this: mongoose.Document & { password?: string }, next) {
    if (!this.isModified("password")) {
      return next();
    }
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  }
);

const userModel = mongoose.model("users", userSchema);

export default userModel;
