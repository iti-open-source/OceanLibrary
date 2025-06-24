import { Router } from "express";
import zodValidator from "../middlewares/zodValidator.js";
import { getAllBooks, createBook } from "../controllers/bookController.js";
import { createBookSchema } from "../utils/validation/bookValidation.js";

const router = Router();

router.get("/", getAllBooks);
router.post("/", zodValidator(createBookSchema), createBook);

export default router;
