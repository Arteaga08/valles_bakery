import express from "express";
const router = express.Router();
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// GET es público, POST es privado (Admin)
router.route("/").get(getCategories).post(protect, admin, createCategory);

router
  .route("/")
  .get(getCategories) // Público
  .post(protect, admin, createCategory); // Protegido

router
  .route("/:id")
  .get(getCategoryById)
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

export default router;
