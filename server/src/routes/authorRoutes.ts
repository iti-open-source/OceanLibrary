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

const router = Router();

router.get("/", getAllAuthors);
router.get("/:id", getAuthorById);
router.post("/", ZodValidator(createAuthorSchema), createAuthor);
router.patch("/:id", ZodValidator(updateAuthorSchema), updateAuthorById);
router.delete("/:id", deleteAuthorById);

export default router;
