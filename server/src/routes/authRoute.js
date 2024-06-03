import { loginGoogleOAuth, callbackGoogleOAuth } from "../controllers/authController.js"
import express from "express"
import authorizeUser from "../middleware/authorizeUser.js"

const router = express.Router();

router.get("/", authorizeUser, (_, res) => res.sendStatus(200));
router.get("/google", loginGoogleOAuth);
router.get("/google/callback", callbackGoogleOAuth);

export default router;