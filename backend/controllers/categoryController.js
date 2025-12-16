// /backend/controllers/categoryController.js

import Category from "../models/Category.js";
// Usaremos express-async-handler (instalar con npm install express-async-handler)
import asyncHandler from "express-async-handler";

// @desc    Create a new Category
// @route   POST /api/categories
// @access  Private (Admin only)
const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, image } = req.body;

  if (!name || !slug) {
    res.status(400);
    throw new Error("Please include a name and slug");
  }

  try {
    const category = await Category.create({ name, slug, image });
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      throw new Error("Category name or slug already exists");
    }
    // Si no es un error de duplicado, es un error del servidor
    res.status(500);
    throw new Error("Server error creating category");
  }
});

// @desc    Get all Categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: 1 });
  res.status(200).json(categories);
});

export {
  createCategory,
  getCategories,
  // Later: updateCategory, deleteCategory
};
