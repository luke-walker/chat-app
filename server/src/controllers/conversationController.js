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
        }

        await conversationModel.create(conv);

        for (const user of users) {
            io.to(user).emit("updateConvs");
        }

        return res.sendStatus(200);
    } catch (err) {
        return res.sendStatus(500);
    }
}

export async function getConversation(req, res) {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const conversation = await conversationModel.findById(id);

        if (!conversation.users.includes(req.session.user._id)) {
            return res.sendStatus(401);
        }

        return res.status(200).json(conversation);
    } catch (err) {
        return res.sendStatus(500);
    }
}

export async function sendMessage(req, res) {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const conversation = await conversationModel.findById(id);

        if (!conversation.users.includes(req.session.user.email)) {
            return res.sendStatus(401);
        }
        
        await conversationModel.findByIdAndUpdate(id, {
            $push: {
                messages: {
                    author: req.session.user.name,
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
