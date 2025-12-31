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

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body; // No necesitamos recibir el slug del body si lo generamos nosotros

  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = name || category.name;
    category.description = description || category.description;

    // LÓGICA DE ACTUALIZACIÓN DE SLUG
    if (name) {
      category.slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Elimina caracteres especiales
        .replace(/[\s_-]+/g, "-") // Reemplaza espacios y guiones bajos por un solo guion
        .replace(/^-+|-+$/g, ""); // Quita guiones al inicio o final
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error("Categoría no encontrada");
  }
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    await category.deleteOne();
    res.json({ message: "Category removed" });
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public (o Private si prefieres)
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    res.status(200).json(category);
  } else {
    res.status(404);
    throw new Error("Categoría no encontrada");
  }
});

export { createCategory, getCategories, updateCategory, deleteCategory, getCategoryById };
