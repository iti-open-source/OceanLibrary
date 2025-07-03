import { Router } from "express";
import {
  getUsers,
  loginUser,
  registerUser,
  updateUser,
  changePassword,
  deleteUser,
  forgetPassword,
  resetPassword,
  reqVerifyUser,
  verifyUser,
  promoteUser,
  banUser,
} from "../controllers/userController.js";
import {
  loginUserSchema,
  registerUserSchema,
  updateUserSchema,
  changePasswordSchema,
  resetPasswordSchema,
} from "../utils/validation/userValidation.js";
import zodValidator from "../middlewares/zodValidator.js";
import { verifyToken, verifyAdmin } from "../middlewares/auth.js";
import { loginLimiter } from "../middlewares/limiter.js";

const router = Router();

router.post("/login", zodValidator(loginUserSchema), loginLimiter, loginUser);
router.post("/register", zodValidator(registerUserSchema), registerUser);
router.patch(
  "/profile",
  zodValidator(updateUserSchema),
  verifyToken,
  updateUser
);
router.patch(
  "/changePassword",
  verifyToken,
  zodValidator(changePasswordSchema),
  changePassword
);
router.patch("/disable", verifyToken, deleteUser);

// verify user feature
router.post("/requestVerification", verifyToken, reqVerifyUser);
router.patch("/verify/:token", verifyUser);

// forgot password feature
router.post("/forgotPassword", verifyToken, forgetPassword);
router.patch(
  "/resetPassword/:token",
  zodValidator(resetPasswordSchema),
  resetPassword
);

// admin api
router.get("/", verifyToken, verifyAdmin, getUsers);
router.patch("/promote/:id", verifyToken, verifyAdmin, promoteUser);
router.patch("/ban/:id", verifyToken, verifyAdmin, banUser);

export default router;
