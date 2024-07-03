import jwt from "jsonwebtoken";

export default function verifyUserToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(403).json({ error: "No bearer toekn provided" });
  }

  const token = authHeader.split("")[1];

  jwt.verify(token, process.env.USER_ACCESS_TOKEN, (err, decode) => {
    if (err) {
      return res.status(401).json({ error: "unauthorization" });
    }
    req.username = decode.username;
    next();
  });
}
