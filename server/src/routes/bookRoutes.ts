import { Router } from "express";
import zodValidator from "../middlewares/zodValidator.js";
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

const router = Router();

router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.post("/", zodValidator(createBookSchema), createBook);
router.patch("/:id", zodValidator(updateBookSchema), updateBookById);
router.delete("/:id", deleteBookById);

export default router;
