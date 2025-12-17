import express from "express";
const router = express.Router();
import {
  getHeroSlides,
  createHeroSlide,
  deleteHeroSlide,
} from "../controllers/heroController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// Esto responde a GET /api/hero-slides
router.get("/", getHeroSlides);

// Esto responde a POST /api/hero-slides (Protegido)
router.post("/", protect, admin, createHeroSlide);

// Esto responde a DELETE /api/hero-slides/:id (Protegido)
router.delete("/:id", protect, admin, deleteHeroSlide);

export default router;
