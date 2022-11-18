import jwt from "jsonwebtoken"

export default (req, res, next) => {
    const token = (req.headers.authorization || "Empty").replace(/Bearer\s?/, "");
    if (token) {
        try {
            const decodedToken = jwt.verify(token, 'lab8');
            req.userId = decodedToken._id;
            next();
        } catch (err) {
            res.status(403).json({
                message: "Not authorized"
            })
        }
    } else {
        return res.status(403).json({
            message: "Not authorized"
        })
    }
}