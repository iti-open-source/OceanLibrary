import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { CustomRequest } from "../middlewares/auth.js";
import { userServiceMail } from "../utils/email.js";
import AppError from "../utils/appError.js";

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  try {
    // check if user exits
    const user = await userModel.findOne({ email: email });
    console.log(user);
    if (!user) {
      return next(new AppError("invalid credentials", 401));
    }
    if (user.active === false) {
      return next(new AppError("user account disabled", 403));
    }
    // check for login password and secret key before token generation
    const comparePassword = await user.comparePassword(password);
    if (comparePassword && process.env.SECRET_KEY) {
      // generate token and return in response
      const token = jwt.sign(
        { userId: user._id, userRole: user.role },
        process.env.SECRET_KEY,
        {
          expiresIn: "12h",
        }
      );
      res.status(200).json({ status: "success", data: token });
    } else {
      return next(new AppError("invalid credentials", 401));
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
  const { username, email, password, phone, address } = req.body;

  try {
    // set first user as admin by default
    const count = await userModel.countDocuments();
    const role = count === 0 ? "admin" : "user";

    const user = await userModel.create({
      username,
      email,
      password,
      phone,
      address,
      role,
    });
    res.status(201).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const allowed = ["username", "email", "phone", "address"];
  const updates: Record<string, string> = {};
  // Filter out only the allowed fields
  for (const field of allowed) {
    if (req.body[field]) {
      updates[field] = req.body[field];
    }
  }
  if (Object.keys(updates).length === 0) {
    return next(new AppError("invalid field updates", 401));
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
    await user.updateOne({ active: false });
    res
      .status(200)
      .json({ status: "success", message: "user deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { password, newPassword } = req.body;
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return next(new AppError("user not found", 404));
    }
    const comparePassword = await user.comparePassword(password);
    if (!comparePassword) {
      return next(new AppError("incorrect password", 400));
    }
    user.password = newPassword;
    await user.save();
    res
      .status(200)
      .json({ status: "success", message: "password changed successfully" });
  } catch (error) {
    next(error);
  }
};

// verify user feature
export const reqVerifyUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = await userModel.findById(req.userId);

  try {
    if (!user || user.verified === true) {
      return next(new AppError("verification request failed", 401));
    }
    // send email with generated token
    const token = await user.createVerificationToken();
    const URL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/verify/${token}`;

    await userServiceMail({
      from: "info@mailtrap.club",
      to: user.email,
      subject: "Verify Email",
      text: `${user.username}, verify your account here:\n${URL}`,
    });
    res.status(200).json({ status: "success", data: token });
  } catch (error) {
    if (user) {
      // reset user data if any failure occurs in the request
      user.verificationToken = undefined;
      user.verificationExpiry = undefined;
      await user.save();
    }
    next(error);
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { token } = req.params;

  try {
    if (!token) {
      return next(new AppError("invalid/expired token", 401));
    }
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await userModel.findOne({
      verificationToken: hashedToken,
      verificationExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return next(new AppError("invalid/expired token", 401));
    }
    user.verified = true;
    user.verificationToken = undefined;
    user.verificationExpiry = undefined;
    await user.save();
    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

// reset password feature
export const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email } = req.body;
  const user = await userModel.findOne({ email: email });

  try {
    if (!user) {
      return next(new AppError("user not found", 404));
    }
    // send email with generated token
    const token = await user.createPasswordResetToken();
    const URL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${token}`;

    await userServiceMail({
      from: "info@mailtrap.club",
      to: email,
      subject: "Password Reset",
      text: `${user.username}, reset your password here:\n${URL}`,
    });
    res.status(200).json({ status: "success", data: token });
  } catch (error) {
    // reset user data if any failure occurs in the request
    if (user) {
      user.passwordResetToken = undefined;
      user.passwordResetExpiry = undefined;
      await user.save();
    }
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // get the token from the patch request made by client
    if (!token) {
      return next(new AppError("invalid/expired token", 401));
    }
    // to find the token in the database the parameter token needs to be hashed first
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await userModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return next(new AppError("invalid/expired token", 401));
    }
    user.password = password;
    user.passwordChangeAt = new Date();
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;
    await user.save();
    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    next(error);
  }
};

// admin controller
export const getUsers = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await userModel.find();
    res.status(200).json({ status: "success", data: users });
  } catch (error) {
    next(error);
  }
};

export const promoteUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id);
    if (!user || user.role === "admin") {
      return next(new AppError("promotion failed", 400));
    }
    await user.updateOne({ role: "admin" });
    res
      .status(200)
      .json({ status: "success", message: "user promoted to admin" });
  } catch (error) {
    next(error);
  }
};

export const banUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return next(new AppError("user not found", 404));
    }
    await user.updateOne({ active: false });
    res
      .status(200)
      .json({ status: "success", message: "user removed successfully" });
  } catch (error) {
    next(error);
  }
};
