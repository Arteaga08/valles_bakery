import mongoose from "mongoose";

const CustomOptionSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "Size",
        "Filling",
        "Shape", // 👈 Este se usará tanto para la opción como para el Producto Base
        "Flavor",
        "Decoration",
        "Extra",
      ],
    },
    name: {
      type: String,
      required: [true, "Please add an option name"],
      trim: true,
    },
    basePrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    image: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // --- AÑADE ESTOS CAMPOS PARA QUE NO SE BORREN AL GUARDAR ---
    shortDescription: {
      type: String,
    },
    shapeType: {
      type: String, // Para identificar si el lienzo es Circular, Corazón, etc.
    },
    allowedOptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CustomOption", // Referencia a otros ingredientes
      },
    ],
  },
  {
    timestamps: true,
  }
);

const CustomOption = mongoose.model("CustomOption", CustomOptionSchema);
export default CustomOption;
