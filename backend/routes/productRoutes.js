// /backend/routes/productRoutes.js

import express from "express";
const router = express.Router();
import {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
} from "../controllers/productController.js";
// import { protect, admin } from '../middleware/authMiddleware.js'; // Middleware de Auth

router.route("/").get(getProducts).post(createProduct); // POST necesita auth
router.route("/:id").get(getProductById).delete(deleteProduct); // DELETE necesita auth

export default router;
