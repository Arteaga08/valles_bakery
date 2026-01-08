import express from "express";
const router = express.Router();
import {
  createCustomOption,
  getCustomOptions,
  updateCustomOption,
  deleteCustomOption,
  getCustomProducts,
  getCustomProductById,
  createCustomProductBase,
  updateCustomProductBase,
  deleteCustomProductBase,
} from "../controllers/customOptionController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// --- 1. RUTAS DE PRODUCTOS BASE (Lienzos/Formas) ---

router
  .route("/products")
  .get(getCustomProducts) // Trae todos los pasteles para el menú
  .post(protect, admin, createCustomProductBase);

router
  .route("/products/:id")
  .get(getCustomProductById)
  .put(protect, admin, updateCustomProductBase)
  .delete(protect, admin, deleteCustomProductBase);

// --- 2. RUTAS DE OPCIONES (Ingredientes/Extras) ---

router
  .route("/")
  .get(getCustomOptions)
  .post(protect, admin, createCustomOption);

router
  .route("/:id")
  .put(protect, admin, updateCustomOption)
  .delete(protect, admin, deleteCustomOption);

export default router;
