import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import AppError from "../utils/appError.js";
import { CustomRequest } from "../middlewares/auth.js";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await userModel.find();
    if (users.length === 0) {
      res.status(200).json({ status: "success", data: "no data" });
    } else {
      res.status(200).json({ status: "success", data: users });
    }
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  try {
    // check if user exits
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return next(new AppError("invalid credentials", 400));
    }
    // check for login password and secret key before token generation
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log(user);
    if (isValidPassword && process.env.SECRET_KEY) {
      // generate token and return in response
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      res.status(200).json({ status: "success", data: user, token: token });
    } else {
      return next(new AppError("invalid credentials", 400));
    }
  } catch (error) {
    next(error);
  }
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, email, password, phone, address, role } = req.body;

  try {
    const newUser = await userModel.create({
      username,
      email,
      password,
      phone,
      address,
      role,
    });
    await newUser.save();
    res.status(201).json({ status: "success", data: newUser });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const allowed = ["username", "email", "password", "phone", "address"];
  const updates: Record<string, number> = {};
  // Filter out only the allowed fields
  for (const field of allowed) {
    if (req.body[field]) {
      updates[field] = req.body[field];
    }
  }
  if (Object.keys(updates).length === 0) {
    return next(new AppError("invalid field updates", 400));
  }

  try {
    const user = await userModel.findOne({ _id: req.userId });
    if (!user) {
      return next(new AppError("user not found", 404));
    }
    Object.assign(user, updates);
    await user.save();
    res
      .status(200)
      .json({ status: "success", message: "user updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) return next(new AppError("user not found", 404));
    await userModel.findByIdAndDelete(req.userId);
    res
      .status(200)
      .json({ status: "success", message: "user deleted successfully" });
  } catch (error) {
    next(error);
  }
};
