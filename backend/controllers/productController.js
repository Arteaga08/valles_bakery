// /backend/controllers/productController.js

import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";

// @desc    Create a new Product
// @route   POST /api/products
// @access  Private (Admin only)
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    shortDescription,
    price,
    category,
    images,
    sizes,
    preparationTimeMin,
    isCustomizable,
  } = req.body;

  if (
    !name ||
    !slug ||
    !category ||
    !images ||
    images.length === 0 ||
    !sizes ||
    sizes.length === 0
  ) {
    res.status(400);
    throw new Error(
      "Please fill all required fields: name, slug, category, images, and sizes."
    );
  }

  const productExists = await Product.findOne({ slug });

  if (productExists) {
    res.status(400);
    throw new Error("A product with this slug already exists.");
  }

  const product = await Product.create({
    name,
    slug,
    shortDescription,
    price,
    category,
    images,
    sizes,
    preparationTimeMin,
    isCustomizable,
  });

  res.status(201).json(product);
});

// @desc    Get all Products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true }).populate(
    "category",
    "name slug"
  );
  res.status(200).json(products);
});

// @desc    Get Product by ID (for single product page)
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "category",
    "name"
  );

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete Product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export { createProduct, getProducts, getProductById, deleteProduct };
