export default function authorizeUser(req, res, next) {
    if (!req.session.user) {
        return res.sendStatus(401);
    }

    return next();
}