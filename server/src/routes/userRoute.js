import { getUserData } from "../controllers/userController.js"
import express from "express"
import authorizeUser from "../middleware/authorizeUser.js"

const router = express.Router();

router.get("/:email", [authorizeUser], getUserData);

export default router;
