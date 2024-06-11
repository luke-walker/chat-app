import conversationModel from "../models/conversationModel.js"
import { getConversationsByEmail } from "../utils/conversationUtil.js"
import mongoose from "mongoose";

import { io } from "../server.js"

export async function getConversations(req, res) {
    try {
        const convs = await getConversationsByEmail(req.session.user.email);
        return res.status(200).json(convs);
    } catch (err) {
        return res.sendStatus(500);
    }
}

export async function createConversation(req, res) {
    try {
        const name = req.body.name;
        const users = [req.session.user.email, ...req.body.users];
        const conv = {
            name,
            users,
            messages: []
        };

        const newConv = await conversationModel.create(conv);

        for (const user of users) {
            io.to(user).emit("joinRoom", newConv._id.toString());
            io.to(user).emit("updateConvs");
        }

        return res.sendStatus(200);
    } catch (err) {
        return res.sendStatus(500);
    }
}

export async function leaveConversation(req, res) {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const email = req.session.user.email;
        const conv = await conversationModel.findByIdAndUpdate(id, {
            $pull: {
                users: email
            }
        });

        if (conv.users.length === 0 || (conv.users.length === 1 && conv.users[0] === email)) {
            await conversationModel.findByIdAndDelete(id);
        }

        io.to(email).emit("leaveRoom", id.toString());
        io.to(email).to(id.toString()).emit("updateConvs");

        return res.sendStatus(200);
    } catch (err) {
        return res.sendStatus(500);
    }
}

export async function getConversation(req, res) {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const conv = await conversationModel.findById(id);

        if (!conv.users.includes(req.session.user._id)) {
            return res.sendStatus(401);
        }

        return res.status(200).json(conv);
    } catch (err) {
        return res.sendStatus(500);
    }
}

export async function sendMessage(req, res) {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const conv = await conversationModel.findById(id);

        if (!conv.users.includes(req.session.user.email)) {
            return res.sendStatus(401);
        }
        
        await conversationModel.findByIdAndUpdate(id, {
            $push: {
                messages: {
                    authorName: req.session.user.name,
                    authorEmail: req.session.user.email,
                    content: req.body.content,
                    timestamp: new Date()
                }
            }
        });

        io.to(id.toString()).emit("updateConvs");

        return res.sendStatus(200);
    } catch (err) {
        return res.sendStatus(500);
    }
}