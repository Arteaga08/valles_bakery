import mongoose from "mongoose";

const imageSchema = mongoose.Schema(
  {
    url: { type: String, required: true },
    isMain: { type: Boolean, default: false },
  },
  { _id: false }
);

const sizeSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    priceAdjustment: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    longDescription: String,

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    images: {
      type: [imageSchema],
      required: true,
    },

    sizes: {
      type: [sizeSchema],
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    isCustomizable: {
      type: Boolean,
      default: false,
    },

    preparationTimeMin: {
      type: Number,
      default: 24,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
