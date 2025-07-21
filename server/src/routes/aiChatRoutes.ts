import express from "express";
import { chatWithAi } from "../controllers/aiChatController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", verifyToken ,chatWithAi);

export default router;
