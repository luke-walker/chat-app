import authorizeUser from "../middleware/authorizeUser.js"
import { createConversation, getConversation, getConversations, sendMessage } from "../controllers/conversationController.js"
import express from "express"

const router = express.Router();

router.get("/", [authorizeUser], getConversations);
router.post("/", [authorizeUser], createConversation);
router.get("/:id", [authorizeUser], getConversation);
router.post("/:id", [authorizeUser], sendMessage);

export default router;
