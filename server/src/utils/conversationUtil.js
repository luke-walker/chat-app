import conversationModel from "../models/conversationModel.js"

export async function getConversationsByEmail(email) {
    return await conversationModel.find({users: email}) || [];
}