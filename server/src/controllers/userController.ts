import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import {
  registerUserSchema,
  updateUserSchema,
} from "../utils/validation/userValidation.js";
import AppError from "../utils/appError.js";
import { UpdatedUserData } from "../types/types.js";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await userModel.find();
    res.status(200).json({ data: users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const { error } = registerUserSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.message, 400));
    }
    if (!username || !email || !password) {
      return next(new AppError("Missing data", 400));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ status: "success", data: newUser });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, email, password } = req.body;
  try {
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.message, 400));
    }
    const updateData: UpdatedUserData = {};
    const user = await userModel.findById(req.params.id);
    if (!user) return next(new AppError("User not found", 404));

    if (username) {
      updateData.username = username;
    }
    if (email) {
      updateData.email = email;
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    await userModel.findByIdAndUpdate(req.params.id, updateData);
    res
      .status(200)
      .json({ status: "success", message: "user updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return next(new AppError("User not found", 404));
    await userModel.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ status: "success", message: "user deleted successfully" });
  } catch (error) {
    next(error);
  }
};
