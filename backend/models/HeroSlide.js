import mongoose from "mongoose";

const heroSlideSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    order: { type: Number, default: 0 }, // Para decidir cuál va primero
    public_id: { type: String, required: true }, // ID de Cloudinary para poder borrarla después
  },
  { timestamps: true }
);

const HeroSlide = mongoose.model("HeroSlide", heroSlideSchema);
export default HeroSlide;
