import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import {
  loginUserSchema,
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

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error } = loginUserSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.message, 400));
  }
  const { email, password } = req.body;

  try {
    // check if user exits
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return next(new AppError("invalid credentials", 400));
    }
    // check for login password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      res.status(200).json({ status: "success", data: user });
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
  const { error } = registerUserSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.message, 400));
  }
  const { username, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    // create user with hashed password
    const newUser = await userModel.create({
      username: username,
      email: email,
      password: hash,
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
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.message, 400));
  }
  const { username, email, password } = req.body;
  const updateData: UpdatedUserData = {};

  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
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
