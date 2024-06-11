
import jwt from "jsonwebtoken"

export default function verifyUserToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send({ error: "No token provided" });
  }

  jwt.verify(token, process.env.USER_ACCESS_TOKEN, (err, decode) => {
    if (err) {
      return res.status(401).json({ error: "unauthorization" });
    }
    req.username = decode.username;
    next();
  });
};
