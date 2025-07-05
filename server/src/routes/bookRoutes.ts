import { Router } from "express";
import {
  getAllBooks,
  createBook,
  getBookById,
  updateBookById,
  deleteBookById,
} from "../controllers/bookController.js";
import {
  createBookSchema,
  updateBookSchema,
} from "../utils/validation/bookValidation.js";
import { uploadImage } from "../middlewares/fileUpload.js";
import { validateFormData } from "../middlewares/formDataValidator.js";
import { processImageFile } from "../middlewares/imageProcessor.js";
import { verifyAdmin, verifyToken } from "../middlewares/auth.js";

const router = Router();

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post(
  "/",
  uploadImage.single("image"),
  validateFormData(createBookSchema),
  processImageFile(),
  verifyToken,
  verifyAdmin,
  createBook
);
router.patch(
  "/:id",
  uploadImage.single("image"),
  validateFormData(updateBookSchema),
  processImageFile(),
  verifyToken,
  verifyAdmin,
  updateBookById
);
router.delete("/:id", verifyToken, verifyAdmin, deleteBookById);

export default router;
