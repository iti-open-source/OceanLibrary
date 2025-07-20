import { Router } from "express";
import {
  getUsers,
  loginUser,
  registerUser,
  updateUser,
  changePassword,
  disableUser,
  forgetPassword,
  resetPassword,
  requestVerification,
  confirmVerification,
  promoteUser,
  banUser,
  demoteUser,
  unbanUser,
  getCurrentUser,
} from "../controllers/userController.js";
import {
  loginUserSchema,
  registerUserSchema,
  updateUserSchema,
  changePasswordSchema,
  resetPasswordSchema,
} from "../utils/validation/userValidation.js";
import zodValidator from "../middlewares/zodValidator.js";
import {
  verifyToken,
  verifyAdmin,
  verifySuperAdmin,
} from "../middlewares/auth.js";
import { emailRequestsLimiter, loginLimiter } from "../middlewares/limiter.js";

const router = Router();

router.post("/login", zodValidator(loginUserSchema), loginLimiter, loginUser);
router.post("/register", zodValidator(registerUserSchema), registerUser);
router.get("/profile", verifyToken, getCurrentUser);
router.patch(
  "/profile",
  zodValidator(updateUserSchema),
  verifyToken,
  updateUser
);
router.patch("/disable", verifyToken, disableUser);
router.patch(
  "/change-password",
  verifyToken,
  zodValidator(changePasswordSchema),
  changePassword
);

// verify user feature
router.post(
  "/verify/request",
  verifyToken,
  emailRequestsLimiter,
  requestVerification
);
router.patch("/verify/confirm/:token", confirmVerification);

// forgot password feature
router.post("/forgot-password", emailRequestsLimiter, forgetPassword);
router.patch(
  "/reset-password/:token",
  zodValidator(resetPasswordSchema),
  resetPassword
);

// admin api
router.get("/", verifyToken, verifyAdmin, getUsers);
router.patch("/admin/ban/:id", verifyToken, verifyAdmin, banUser);
router.patch("/admin/unban/:id", verifyToken, verifyAdmin, unbanUser);

// super-admin api
router.patch("/promote/:id", verifyToken, verifySuperAdmin, promoteUser);
router.patch("/demote/:id", verifyToken, verifySuperAdmin, demoteUser);
router.patch("/super-admin/ban/:id", verifyToken, verifySuperAdmin, banUser);
router.patch(
  "/super-admin/unban/:id",
  verifyToken,
  verifySuperAdmin,
  unbanUser
);

export default router;
