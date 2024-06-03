import userModel from "../models/userModel.js"

export async function getUserData(req, res) {
    try {
        const email = req.params.email;
        const userData = await userModel.find({email});
        return res.json(userData);
    } catch (err) {
        return res.sendStatus(500);
    }
}
