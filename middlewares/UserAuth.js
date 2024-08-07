import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(403).json({
            error: "No token provided...!"
        });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.USER_ACCESS_TOKEN, (error, decoded) => {
        if (error) {
            console.log(error);
            return res.status(403).json({
                error: "token verification failed...!"
            })
        }
        req.username = decoded.username;
        next();
    });
};

export default verifyToken;