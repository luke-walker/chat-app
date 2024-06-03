import authorizeUser from "../middleware/authorizeUser.js"
import { getConversations, sendMessage } from "../controllers/conversationController.js"
import express from "express"

const router = express.Router();

router.get("/", [authorizeUser], getConversations);
router.post("/:id", [authorizeUser], sendMessage);

export default router;
