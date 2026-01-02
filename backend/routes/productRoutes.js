import express from "express";
const router = express.Router();

import {
  createProduct,
  getProducts,
  getBestSellers,
  getProductBySlug,
  getProductById,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

// PUBLIC
router.get("/", getProducts);
router.get("/bestsellers", getBestSellers);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);

// ADMIN
router.post("/", protect, admin, createProduct);

router
  .route("/:id")
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
