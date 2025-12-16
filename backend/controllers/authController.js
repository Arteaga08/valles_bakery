// /backend/controllers/authController.js

import AdminUser from "../models/AdminUser.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

// Función auxiliar para generar el JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // El token expira en 30 días
  });
};

// @desc    Authenticate admin user & get token
// @route   POST /api/auth/login
// @access  Public
const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Check if user exists and password matches
  const user = await AdminUser.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // 2. Success: Send user data and token
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id), // Generamos el token
    });
  } else {
    res.status(401); // 401 Unauthorized
    throw new Error("Invalid email or password");
  }
});

// @desc    Get Admin profile (used to check session status)
// @route   GET /api/auth/profile
// @access  Private
const getAdminProfile = asyncHandler(async (req, res) => {
  // req.user is set by the 'protect' middleware
  const user = await AdminUser.findById(req.user._id).select("-password"); // Exclude password

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export { authAdmin, getAdminProfile };
