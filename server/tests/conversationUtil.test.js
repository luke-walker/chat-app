import "dotenv/config"
import mongoose from "mongoose"

import { EMAIL_ADDRESS } from "./config"
import conversationModel from "../src/models/conversationModel"
import { getConversationsByEmail } from "../src/utils/conversationUtil"

beforeEach(() => {
    mongoose.connect(process.env.MONGO_DB_URI);
});

afterEach(() => {
    mongoose.disconnect();
});

test("getConversationsByEmail", async () => {
    const allConvs = await conversationModel.find();
    const userConvs = await getConversationsByEmail(EMAIL_ADDRESS);
    
    let count = 0;
    for (const conv of allConvs) {
        if (conv.users.includes(EMAIL_ADDRESS)) {
            count++;
        }
    }

    expect(userConvs.length).toBe(count);
});