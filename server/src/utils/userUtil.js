import userModel from "../models/userModel"

export async function checkUserEmailExists(email) {
    const user = await userModel.find({email}) || [];
    return user.length > 0;
}