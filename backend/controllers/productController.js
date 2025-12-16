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

// @desc    Update Product
// @route   PUT /api/products/:id
// @access  Private (Admin only)
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    shortDescription,
    longDescription,
    price,
    category,
    images,
    sizes,
    preparationTimeMin,
    isCustomizable,
    isActive,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // 1. Actualización de campos básicos
    product.shortDescription = shortDescription || product.shortDescription;
    product.longDescription = longDescription || product.longDescription;
    product.price = price !== undefined ? price : product.price;
    product.category = category || product.category;
    product.images = images || product.images;
    product.sizes = sizes || product.sizes;
    product.preparationTimeMin =
      preparationTimeMin || product.preparationTimeMin;
    product.isCustomizable =
      isCustomizable !== undefined ? isCustomizable : product.isCustomizable;
    product.isActive = isActive !== undefined ? isActive : product.isActive;

    // 2. Lógica de Nombre y Slug Automático
    if (name) {
      product.name = name;
      // Generamos un slug limpio: minúsculas, sin acentos ni caracteres especiales
      product.slug = name
        .toLowerCase()
        .trim()
        .normalize("NFD") // Separa acentos de las letras
        .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
        .replace(/[^\w\s-]/g, "") // Elimina todo lo que no sea letra, espacio o guion
        .replace(/[\s_-]+/g, "-") // Reemplaza espacios por un solo guion
        .replace(/^-+|-+$/g, ""); // Quita guiones al principio o final
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
};
