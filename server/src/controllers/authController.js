import userModel from "../models/userModel.js"

const GOOGLE_REDIRECT_URI = `http://localhost:${process.env.SERVER_PORT}/auth/google/callback`;

export function loginGoogleOAuth(req, res) {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: GOOGLE_REDIRECT_URI,
        response_type: "code",
        scope: "openid email profile"
    });
    return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}

export async function callbackGoogleOAuth(req, res) {
    const code = req.query.code;

    try {
        const params = new URLSearchParams({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code"
        });
        const tokenResponse = await fetch(`https://oauth2.googleapis.com/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params.toString()
        });
        const { id_token } = await tokenResponse.json();
        const userInfo = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id_token}`);
        const userData = await userInfo.json();
        
        if (Object.keys(await userModel.find({email: userData.email})).length === 0) {
            req.session.user = await userModel.create({
                email: userData.email,
                name: userData.name,
                pfp: userData.picture
            });
        }

        return res.redirect(process.env.FRONTEND_URL);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Authentication failed");
    }
}
