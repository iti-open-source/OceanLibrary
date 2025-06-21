import { Router } from "express";
import JoiValidator from "../middlewares/joiValidator.js";
import { getAllBooks, createBook } from "../controllers/bookController.js";
import { createBookSchema } from "../utils/validation/bookValidation.js";

const router = Router();

router.get("/", getAllBooks);
router.post("/", JoiValidator(createBookSchema), createBook);

export default router;
