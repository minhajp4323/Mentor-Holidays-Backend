import jwt from "jsonwebtoken";

export const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ error: "No bearer token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.username = decoded.username;
    next();
  });
};
