import { Router } from "express";
import {
  getUsers,
  loginUser,
  registerUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";
import {
  loginUserSchema,
  registerUserSchema,
  resetPasswordSchema,
  updateUserSchema,
} from "../utils/validation/userValidation.js";
import zodValidator from "../middlewares/zodValidator.js";
import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.get("/", getUsers);
router.post("/login", zodValidator(loginUserSchema), loginUser);
router.post("/register", zodValidator(registerUserSchema), registerUser);
router.patch(
  "/profile",
  zodValidator(updateUserSchema),
  verifyToken,
  updateUser
);
router.delete("/profile", verifyToken, deleteUser);
router.post("/forgotPassword", forgotPassword);
router.patch(
  "/resetPassword/:token",
  zodValidator(resetPasswordSchema),
  resetPassword
);

export default router;
