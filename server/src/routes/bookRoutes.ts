import { Router } from "express";
import zodValidator from "../middlewares/zodValidator.js";
import {
  getAllBooks,
  createBook,
  getBookById,
  updateBookById,
} from "../controllers/bookController.js";
import { createBookSchema } from "../utils/validation/bookValidation.js";

const router = Router();

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", zodValidator(createBookSchema), createBook);
router.patch("/:id", updateBookById);

export default router;
