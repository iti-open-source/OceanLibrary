import { Router } from "express";
import {
  getUsers,
  loginUser,
  registerUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import {
  loginUserSchema,
  registerUserSchema,
  updateUserSchema,
} from "../utils/validation/userValidation.js";
import JoiValidator from "../middlewares/joiValidator.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.get("/", getUsers);
router.post("/login", JoiValidator(loginUserSchema), loginUser);
router.post("/register", JoiValidator(registerUserSchema), registerUser);
router.patch(
  "/profile",
  JoiValidator(updateUserSchema),
  verifyToken,
  updateUser
);
router.delete("/profile", verifyToken, deleteUser);

export default router;
