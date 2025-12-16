// /backend/routes/authRoutes.js

import express from "express";
const router = express.Router();
import { authAdmin, getAdminProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/login", authAdmin); // Public access
router.route("/profile").get(protect, getAdminProfile); // Private access

export default router;
