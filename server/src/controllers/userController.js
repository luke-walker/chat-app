import userModel from "../models/userModel.js"

export async function getUserData(req, res) {
    try {
        const email = req.params.email;
        const userData = await userModel.find({email});
        return res.status(200).json(userData.length > 0 ? userData[0] : []);
    } catch (err) {
        return res.sendStatus(500);
    }
}
