import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { sendMessage, getConversation, getMyContacts } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/send/:receiverId", isAuthenticated, sendMessage);
router.get("/conversation/:otherUserId", isAuthenticated, getConversation);
router.get("/contacts", isAuthenticated, getMyContacts);

export default router;
