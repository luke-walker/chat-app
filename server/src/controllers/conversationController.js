import conversationModel from "../models/conversationModel.js"

export async function getConversations(req, res) {
    try {
        const conversations = await conversationModel.find({users: req.session.user._id});
        return res.status(200).json(conversations);
    } catch (err) {
        return res.sendStatus(500);
    }
}

export async function sendMessage(req, res) {
    try {
        const id = req.params.id;
        const conversation = await conversationModel.find({_id: id});
        
        if (!(conversation.users.includes(req.session.user._id))) {
            return res.sendStatus(401);
        }
        
        await conversationModel.updateOne({_id: id}, {
            $push: {
                messages: {
                    authorId: req.session.user._id,
                    content: req.body.content,
                    timestamp: new Date()
                }
            }
        });

        return res.sendStatus(200);
    } catch (err) {
        return res.sendStatus(500);
    }
}
