// /backend/models/CustomProduct.js
import mongoose from "mongoose";

const customProductSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    image: { type: String, required: true }, // La foto del pastel
    images: [
      {
        url: { type: String },
        isMain: { type: Boolean, default: false },
      },
    ],

    price: { type: Number, required: true, default: 0 }, // Precio base

    // Aquí guardamos qué forma usa este producto (ej: "Heart")
    shapeType: { type: String, required: true },

    // Aquí guardamos qué ingredientes permite este pastel
    allowedOptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CustomOption",
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true, // 👈 Esto es vital para que aparezca en el menú
    },

    shortDescription: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const CustomProduct = mongoose.model("CustomProduct", customProductSchema);
export default CustomProduct;
