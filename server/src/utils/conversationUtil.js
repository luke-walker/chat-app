import conversationModel from "../models/conversationModel.js"

export async function getConversationsByEmail(email) {
    return await conversationModel.find({users: email}) || [];
}

export async function getConversationById(id) {
    return await conversationModel.findById(id);
}