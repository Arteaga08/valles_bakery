import express from "express";
const router = express.Router();
import {
  createOrder,
  getAdminOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// Rutas de cliente (Public access)
router.route("/").post(createOrder);

// Rutas de administración (Private access)
router.route("/admin").get(protect, admin, getAdminOrders);

// Ruta para actualizar el estado del pedido
router.route("/:id/status").put(protect, admin, updateOrderStatus);

export default router;
