// /backend/controllers/orderController.js

import Order from "../models/Order.js";
import asyncHandler from "express-async-handler";

// @desc    Create a new Order (Checkout process)
// @route   POST /api/orders
// @access  Public
const createOrder = asyncHandler(async (req, res) => {
  const {
    items,
    totalPrice,
    customerName,
    customerPhone,
    deliveryDate,
    paymentMethod,
  } = req.body;

  if (
    !items ||
    items.length === 0 ||
    !totalPrice ||
    !deliveryDate ||
    !customerPhone ||
    !paymentMethod
  ) {
    res.status(400);
    throw new Error("Missing required order fields.");
  }

  // Validaciones adicionales (ej: verificar que deliveryDate sea futuro y disponible)
  // ...

  const order = await Order.create({
    items,
    totalPrice,
    customerName,
    customerPhone,
    deliveryDate,
    paymentMethod,
    // status defaults to 'Pending Payment'
  });

  res.status(201).json(order);
});

// @desc    Get all Orders for Admin Panel (Agenda)
// @route   GET /api/orders?startDate=YYYYMMDD&endDate=YYYYMMDD&status=Processing
// @access  Private (Admin only)
const getAdminOrders = asyncHandler(async (req, res) => {
  const { startDate, endDate, status } = req.query;
  let filter = {};

  // Filtrar por estado
  if (status) {
    filter.status = status;
  }

  // Filtrar por rango de fechas (Agenda/Calendario)
  if (startDate || endDate) {
    filter.deliveryDate = {};
    if (startDate) {
      // greater than or equal to start date
      filter.deliveryDate.$gte = new Date(startDate);
    }
    if (endDate) {
      // less than or equal to end date (plus 23:59:59 to include the whole day)
      const dateEnd = new Date(endDate);
      dateEnd.setHours(23, 59, 59, 999);
      filter.deliveryDate.$lte = dateEnd;
    }
  }

  // Obtenemos todos los pedidos que cumplen con el filtro, ordenados por fecha de entrega
  const orders = await Order.find(filter).sort({
    deliveryDate: 1,
    createdAt: 1,
  });

  // Nota: Para el calendario, solo enviamos los campos necesarios (id, deliveryDate, status)
  // Pero para la vista de tabla, enviamos el objeto completo.

  res.status(200).json(orders);
});

// @desc    Update Order Status (Admin action)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin only)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status) {
    res.status(400);
    throw new Error("Please provide a new status");
  }

  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = status;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export {
  createOrder,
  getAdminOrders,
  updateOrderStatus,
  // Later: getOrderById
};
