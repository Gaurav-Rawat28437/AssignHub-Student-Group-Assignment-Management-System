
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    

    const token =
      req.cookies?.token

    if (!token) {
      return res.status(401).json({
        message: "Not authorized. Token missing."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Access denied. Admin only."
    });
  }

  next();
};

module.exports = { protect, adminOnly };
