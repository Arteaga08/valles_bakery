// /backend/models/CustomOption.js

import mongoose from "mongoose";

const CustomOptionSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      // Los tipos de personalización definidos por el cliente (Bizcocho, Relleno, etc.)
      enum: ["CakeTier", "Filling", "Shape", "Extra", "Decoration"],
    },
    name: {
      type: String,
      required: [true, "Please add an option name"],
      trim: true,
    },
    basePrice: {
      type: Number,
      required: true,
      default: 0.0, // Costo adicional por esta opción
    },
    image: {
      type: String, // URL de la imagen que representa esta opción
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const CustomOption = mongoose.model("CustomOption", CustomOptionSchema);

export default CustomOption;
