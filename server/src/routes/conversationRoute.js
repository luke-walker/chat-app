import express from "express"

import authorizeUser from "../middleware/authorizeUser.js"
import {
    createConversation,
    leaveConversation,
    getConversation,
    getConversations,
    sendMessage
} from "../controllers/conversationController.js"

const router = express.Router();

router.get("/", [authorizeUser], getConversations);
router.post("/create", [authorizeUser], createConversation);
router.get("/:id", [authorizeUser], getConversation);
router.post("/:id", [authorizeUser], sendMessage);
router.post("/leave/:id", [authorizeUser], leaveConversation);

export default router;
