import jwt, { decode } from "jsonwebtoken";

export const verifyAdminToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    res.json("No token provided");
  }
  jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      res.status(401).json({ error: "Unauthorized" });
    }
    req.username = decoded.username;
  });
};
