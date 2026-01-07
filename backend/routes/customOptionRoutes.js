import express from "express";
const router = express.Router();
import {
  createCustomOption,
  getCustomOptions,
  updateCustomOption,
  deleteCustomOption,
  getCustomProducts, // Asegúrate de que esté importado
  createCustomProductBase,
  updateCustomProductBase,
} from "../controllers/customOptionController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// --- 1. RUTAS ESPECÍFICAS (Deben ir primero) ---

// Rutas para los Productos Base (Lienzos/Formas)
router
  .route("/products")
  .get( getCustomProducts) // Ahora Express encontrará esto primero
  .post(protect, admin, createCustomProductBase);

router.route("/products/:id").put(protect, admin, updateCustomProductBase);

// --- 2. RUTAS DINÁMICAS (Deben ir al final) ---

// Rutas para las Opciones (Bizcochos, Rellenos, etc.)
router
  .route("/")
  .get(getCustomOptions)
  .post(protect, admin, createCustomOption);

// Esta ruta es la que "atrapaba" a /products antes. Al estar abajo, ya no hay conflicto.
router
  .route("/:id")
  .put(protect, admin, updateCustomOption)
  .delete(protect, admin, deleteCustomOption);

export default router;
