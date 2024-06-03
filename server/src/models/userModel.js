import mongoose from "mongoose"

export default mongoose.model("User", new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    pfp: {
        type: String,
        required: true
    }
}));
