import conversationModel from "../models/conversationModel.js"
import mongoose from "mongoose";

export async function getConversations(req, res) {
    try {
        const conversations = await conversationModel.find({users: req.session.user.email}) || [];
        return res.status(200).json(conversations);
    } catch (err) {
        return res.sendStatus(500);
    }
}

export async function createConversation(req, res) {
    try {
        const name = req.body.name;
        const users = [req.session.user.email, ...req.body.users];
        const conversation = {
            name,
            users,
            messages: []
        }

        return res.status(200).json(await conversationModel.create(conversation));
    } catch (err) {
        return res.sendStatus(500);
    }
}

export async function getConversation(req, res) {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const conversation = await conversationModel.findById(id);

        if (!(conversation.users.includes(req.session.user._id))) {
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

        if (!(conversation.users.includes(req.session.user.email))) {
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

        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}
