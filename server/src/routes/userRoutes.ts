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

export default router;
