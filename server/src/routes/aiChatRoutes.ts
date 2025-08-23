import express from "express";
import { chatWithAI } from "../controllers/aiChatController.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", verifyToken, chatWithAI);

export default router;
