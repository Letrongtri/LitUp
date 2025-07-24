const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace(/^Bearer\s+/, "");

  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied. No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT Error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authenticateToken;
