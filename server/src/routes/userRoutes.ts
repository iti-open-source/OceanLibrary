import { Router } from "express";
import {
  getUsers,
  loginUser,
  registerUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = Router();

router.get("/", getUsers);
router.get("/login", loginUser);
router.post("/register", registerUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
