import { Router } from "express";
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthorById,
  deleteAuthorById,
} from "../controllers/authorController.js";
import ZodValidator from "../middlewares/zodValidator.js";
import {
  createAuthorSchema,
  updateAuthorSchema,
} from "../utils/validation/authorValidation.js";
import { verifyAdmin, verifyToken } from "../middlewares/auth.js";

const router = Router();

router.get("/", getAllAuthors);
router.get("/:id", getAuthorById);
router.post(
  "/",
  ZodValidator(createAuthorSchema),
  verifyToken,
  verifyAdmin,
  createAuthor
);
router.patch(
  "/:id",
  ZodValidator(updateAuthorSchema),
  verifyToken,
  verifyAdmin,
  updateAuthorById
);
router.delete("/:id", verifyToken, verifyAdmin, deleteAuthorById);

export default router;
