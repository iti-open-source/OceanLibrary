import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import { UpdateData } from "../types/user.js";

async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await userModel.find();
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json(error);
  }
}

async function getUserById(req: Request, res: Response): Promise<void> {
  try {
    const user = await userModel.findById(req.params.id);
    if (user) {
      res.status(200).json({ data: user });
    } else {
      res.status(404).json({ error: "user not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

async function createUser(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      res.status(400).json({ error: "missing data" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await userModel.create({
        username: username,
        email: email,
        password: hashedPassword,
      });
      await newUser.save();
      res.status(201).json({ data: newUser });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

async function updateUser(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body;
  try {
    const updateData: UpdateData = {};
    const user = await userModel.findById(req.params.id);
    if (user) {
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
      res.status(200).json({ data: "user updated successfully" });
    } else {
      res.status(404).json({ error: "user not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const user = userModel.findById(req.params.id);
    if (user) {
      await userModel.deleteOne(user);
      res.status(200).json({ result: "user deleted successfully" });
    } else {
      res.status(404).json({ error: "user not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

const userController = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

export default userController;
