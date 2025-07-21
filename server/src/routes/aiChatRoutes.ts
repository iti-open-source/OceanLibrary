import express from "express";
import { chatWithAi } from "../controllers/aiChatController.js";

const router = express.Router();

router.post("/", chatWithAi);

export default router;
