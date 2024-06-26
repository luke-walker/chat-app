import "dotenv/config"
import cors from "cors"
import express from "express"
import { rateLimit } from "express-rate-limit"
import session from "express-session"
import http from "http"
import mongoose from "mongoose"
import { Server } from "socket.io"

import authRouter from "./routes/authRoute.js"
import conversationRouter from "./routes/conversationRoute.js"
import userRouter from "./routes/userRoute.js"
import { getConversationsByEmail } from "./utils/conversationUtil.js"

const app = express();
const httpServer = http.Server(app);
export const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
});

/*
 *  MIDDLEWARE
 */

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        secure: false,
        httpOnly: false
    }
});

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

app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

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

io.on("connection", async (socket) => {
    if (!socket.request.session.user) {
        return;
    }

    const email = socket.request.session.user.email;

    async function refreshRooms() {
        const convs = await getConversationsByEmail(email);
        const convIds = convs.map((conv) => conv._id.toString());

        for (const room of socket.rooms) {
            socket.leave(room);
        }
        socket.join([email, ...convIds]);
    }

    refreshRooms();
    socket.on("refreshRooms", refreshRooms);

    socket.on("joinRoom", (room) => {
        socket.join(room);
    });

    socket.on("leaveRoom", (room) => {
        socket.leave(room);
    });
});

httpServer.listen(process.env.SERVER_PORT, (err) => {
    if (err) {
        throw err;
    }

    mongoose.connect(process.env.MONGO_DB_URI);

    console.log(`Server running on port ${process.env.SERVER_PORT}.`);
});
