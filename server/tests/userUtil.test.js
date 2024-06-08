import "dotenv/config"
import mongoose from "mongoose"

import { EMAIL_ADDRESS } from "./config"
import userModel from "../src/models/userModel"
import { checkUserEmailExists } from "../src/utils/userUtil"

beforeEach(() => {
    mongoose.connect(process.env.MONGO_DB_URI);
});

afterEach(() => {
    mongoose.disconnect();
});

test("checkUserEmailExists", async () => {
    const allUsers = await userModel.find();

    function userExists(email) {
        for (const user of allUsers) {
            if (user.email === email) {
                return true;
            }
        }
        return false;
    }

    expect(await checkUserEmailExists(EMAIL_ADDRESS)).toBe(userExists(EMAIL_ADDRESS));
    expect(await checkUserEmailExists("notanemail")).toBe(userExists("notanemail"));
    expect(await checkUserEmailExists("")).toBe(userExists(""));
});