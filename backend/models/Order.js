// /backend/models/Order.js

import mongoose from "mongoose";

// --- 1. Sub-Schema for Custom Details (inside a custom product item) ---
const CustomDetailSchema = mongoose.Schema({
  optionType: { type: String, required: true },
  optionName: { type: String, required: true },
  baseCost: { type: Number, required: true },
});

// --- 2. Sub-Schema for Order Items (Standard or Custom) ---
const OrderItemSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  type: {
    type: String,
    enum: ["Standard", "Custom"],
    required: true,
  },
  name: { type: String, required: true }, // Guardamos el nombre aquí por si el producto es eliminado
  quantity: { type: Number, required: true, default: 1 },
  selectedSize: { type: String }, // Solo aplica a productos estándar
  customDetails: [CustomDetailSchema], // Solo aplica a productos custom
  notes: { type: String }, // Notas del cliente sobre la personalización
  unitPrice: { type: Number, required: true }, // Precio base del producto + extras de customización
  finalPrice: { type: Number, required: true }, // unitPrice * quantity
});

// --- 3. Main Order Schema ---
const OrderSchema = mongoose.Schema(
  {
    items: [OrderItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    amountPaid: { type: Number, default: 0.0 },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true }, // Para WhatsApp

    deliveryDate: {
      type: Date,
      required: [true, "Please provide a delivery date"],
    },
    // --- AGREGAR ESTAS LÍNEAS ---
    deliveryTime: {
      type: String,
      required: [true, "Please provide a delivery time"],
    },
    deliveryMethod: {
      type: String,
      enum: ["Pickup", "Delivery"],
      default: "Pickup",
    },
    deliveryAddress: {
      type: String,
    },

    status: {
      type: String,
      required: true,
      enum: [
        "Pending Payment",
        "Processing",
        "Ready",
        "Completed",
        "Cancelled",
      ],
      default: "Pending Payment",
    },
    paymentMethod: {
      type: String,
      required: true,
      // Los métodos que ofrezcas (ej: "Transferencia", "Efectivo", "Tarjeta en sitio")
      enum: ["Transfer", "CashOnDelivery", "Other"],
    },

    // Campo para que el Admin pueda asignar capacidad/estado
    adminNotes: { type: String },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;
