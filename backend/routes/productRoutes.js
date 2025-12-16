// /backend/routes/productRoutes.js

import express from "express";
const router = express.Router();
import {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";
import { protect, admin } from '../middleware/authMiddleware.js'; // Middleware de Auth

router.route("/").get(getProducts).post(protect, admin, createProduct);

router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct); // <-- Ruta para actualizar

export default router;
