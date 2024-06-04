import mongoose from "mongoose"

export default mongoose.model("Conversation", new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    users: {
        type: [String],
        required: true
    },
    messages: [
        {
            author: {
                type: String,
                required: true
            },
            content: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                required: true
            }
        }
    ]
}));
