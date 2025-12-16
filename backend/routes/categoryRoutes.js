import express from "express";
const router = express.Router();
import {
  createCategory,
  getCategories,
} from "../controllers/categoryController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// GET es público, POST es privado (Admin)
router.route("/").get(getCategories).post(protect, admin, createCategory);

export default router;
