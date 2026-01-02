import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";

const handleUpload = async (files) => {
  const uploadedUrls = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "tu_preset"); // Configura esto en Cloudinary

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/tu_user/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    uploadedUrls.push(data.secure_url);
  }

  return uploadedUrls; // Esto devuelve el arreglo [url1, url2] que espera tu backend
};
// ==============================
// CREATE
// ==============================
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    shortDescription,
    longDescription,
    price,
    category,
    images,
    sizes,
    tags,
    isBestSeller,
    preparationTimeMin,
    isCustomizable,
  } = req.body;

  if (!name || !slug || !category || !images?.length || !sizes?.length) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  const exists = await Product.findOne({ slug });
  if (exists) {
    res.status(400);
    throw new Error("Product with this slug already exists");
  }

  const product = await Product.create({
    name,
    slug,
    shortDescription,
    longDescription,
    price,
    category,
    images,
    sizes,
    tags,
    isBestSeller,
    preparationTimeMin,
    isCustomizable,
  });

  res.status(201).json(product);
});

// ==============================
// GET ALL
// ==============================
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true }).populate(
    "category",
    "name slug"
  );
  res.json(products);
});

// ==============================
// BEST SELLERS (HOME)
// ==============================
const getBestSellers = asyncHandler(async (req, res) => {
  const products = await Product.find({
    isActive: true,
    isBestSeller: true,
  })
    .limit(12)
    .populate("category", "name slug");

  res.json(products);
});

// ==============================
// GET ONE
// ==============================
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "category",
    "name slug"
  );

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
});

// ==============================
// DELETE
// ==============================
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.json({ message: "Product removed" });
});

// ==============================
// UPDATE
// ==============================
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  Object.assign(product, req.body);

  if (req.body.name) {
    product.slug = req.body.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  const updated = await product.save();
  res.json(updated);
});

// ==============================
// GET BY SLUG (CÁTALOGO PÚBLICO)
// ==============================
const getProductBySlug = asyncHandler(async (req, res) => {
  // Buscamos específicamente por el campo 'slug'
  const product = await Product.findOne({ slug: req.params.slug }).populate(
    "category",
    "name slug"
  );

  if (!product) {
    res.status(404);
    throw new Error("Producto no encontrado");
  }

  res.json(product);
});

export {
  handleUpload,
  createProduct,
  getProducts,
  getBestSellers,
  getProductBySlug,
  getProductById,
  deleteProduct,
  updateProduct,
};
