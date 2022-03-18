const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the
      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401).json({
          success: false,
          message: "Error, You are not user. user not found",
        });
      }
    } catch (error) {
      res.status(401).json({ success: false, message: "Not authorized" });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }
});

module.exports = { protect };
