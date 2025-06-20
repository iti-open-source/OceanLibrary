import { Router } from "express";
import bookController from "../controllers/bookController.js";
import JoiValidator from "../middlewares/joiValidator.js";
import { createBookSchema } from "../utils/validation/bookValidation.js";

const router = Router();

// GET /api/books - Get all books
router.get("/", bookController.getAllBooks);

// POST /api/books - Create new book
router.post("/", JoiValidator(createBookSchema), bookController.createBook);

export default router;
