import { Router } from "express";
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthorById,
  deleteAuthorById,
} from "../controllers/authorController.js";
import {
  createAuthorSchema,
  updateAuthorSchema,
} from "../utils/validation/authorValidation.js";
import { uploadImage } from "../middlewares/fileUpload.js";
import { validateFormData } from "../middlewares/formDataValidator.js";
import { processImageFile } from "../middlewares/imageProcessor.js";
import { verifyAdmin, verifyToken } from "../middlewares/auth.js";

const router = Router();

router.get("/", getAllAuthors);
router.get("/:id", getAuthorById);
router.post(
  "/",
  uploadImage.single("photo"),
  validateFormData(createAuthorSchema),
  processImageFile("uploads/authors/", "photo"),
  verifyToken,
  verifyAdmin,
  createAuthor
);
router.patch(
  "/:id",
  uploadImage.single("photo"),
  validateFormData(updateAuthorSchema),
  processImageFile("uploads/authors/", "photo"),
  verifyToken,
  verifyAdmin,
  updateAuthorById
);
router.delete("/:id", verifyToken, verifyAdmin, deleteAuthorById);

export default router;
