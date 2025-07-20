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
import { cacheMiddleware } from "../middlewares/cache.js";

const router = Router();

router.get("/", cacheMiddleware(300), getAllBooks);
router.get("/:id", cacheMiddleware(600), getBookById);
router.post(
  "/",
  uploadImage.single("image"),
  validateFormData(createBookSchema),
  processImageFile("uploads/books/", "image"),
  verifyToken,
  verifyAdmin,
  createBook
);
router.patch(
  "/:id",
  uploadImage.single("image"),
  validateFormData(updateBookSchema),
  processImageFile("uploads/books/", "image"),
  verifyToken,
  verifyAdmin,
  updateBookById
);
router.delete("/:id", verifyToken, verifyAdmin, deleteBookById);

export default router;
