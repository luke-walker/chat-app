import "dotenv/config"
import cors from "cors"
import express from "express"
import { rateLimit } from "express-rate-limit"
import session from "express-session"
import { Server } from "socket.io"
import mongoose from "mongoose"
import { createServer } from "node:http"
import authRouter from "./routes/authRoute.js"
import conversationRouter from "./routes/conversationRoute.js"
import userRouter from "./routes/userRoute.js"

const app = express();
const server = createServer();
const io = new Server(server);

/*
 *  MIDDLEWARE
 */

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 250,
    standardHeaders: 'draft-7',
    legacyHeaders: false
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: false,
        httpOnly: false
    }
}));

app.use(express.json());

/*
 *  ROUTES
 */

app.use("/auth", authRouter);
app.use("/conv", conversationRouter);
app.use("/user", userRouter);

app.get("/logout", (req, res) => {
    req.session.destroy();
    return res.sendStatus(200);
});

/*
 *  START SERVER
 */

app.listen(process.env.SERVER_PORT, (err) => {
    if (err) {
        throw err;
    }

    mongoose.connect(process.env.MONGO_DB_URI);

    console.log(`Server running on port ${process.env.SERVER_PORT}.`);
});
