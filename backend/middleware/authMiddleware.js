// /backend/middleware/authMiddleware.js

import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import AdminUser from "../models/AdminUser.js";

// Middleware principal para verificar el token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check for token in the 'Authorization' header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (format: "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID and attach it to the request object (excluding password)
      req.user = await AdminUser.findById(decoded.id).select("-password");

      next(); // Continue to the next middleware/controller
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Middleware para verificar que el usuario sea Admin
const admin = (req, res, next) => {
  // Assuming the user is attached via the 'protect' middleware
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res.status(403); // 403 Forbidden
    throw new Error("Not authorized as an admin");
  }
};

export { protect, admin };
