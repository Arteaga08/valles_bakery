import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import chalk from "chalk";

import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import customOptionRoute from "./routes/customOptionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import heroRoutes from "./routes/heroRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import {
  createHeroSlide,
  getHeroSlides,
} from "./controllers/heroController.js";
// Importaremos el middleware de errores más tarde
// import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load env variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser for raw JSON data

//Rutas de autemticación
app.use("/api/auth", authRoutes);
// --- Use API Routes Protect ---
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/custom-options", customOptionRoute);
app.use("/api/orders", orderRoutes);

app.use("/api/hero-slides", heroRoutes);
app.get("/api/hero-slides", getHeroSlides);
app.post("/api/hero-slides", createHeroSlide);
// Manejo de Errores (Se añadirán más adelante)
app.use(notFound);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Bakery API is running...");
});

const PORT = process.env.PORT || 50002;

app.listen(PORT, () =>
  console.log(chalk.yellow(`Server running on port ${PORT}`))
);
