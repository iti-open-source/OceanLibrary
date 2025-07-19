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
router.patch(
  "/profile",
  zodValidator(updateUserSchema),
  verifyToken,
  updateUser
);
router.patch("/disable", verifyToken, disableUser);
router.patch(
  "/changePassword",
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
router.post(
  "/forgotPassword",
  verifyToken,
  emailRequestsLimiter,
  forgetPassword
);
router.patch(
  "/resetPassword/:token",
  zodValidator(resetPasswordSchema),
  resetPassword
);

// admin api
router.get("/", verifyToken, verifyAdmin, getUsers);
router.patch("/admin/ban/:id", verifyToken, verifyAdmin, banUser);

// super-admin api
router.patch("/promote/:id", verifyToken, verifySuperAdmin, promoteUser);
router.patch("/demote/:id", verifyToken, verifySuperAdmin, demoteUser);
router.patch("/superAdmin/ban/:id", verifyToken, verifySuperAdmin, banUser);

export default router;
