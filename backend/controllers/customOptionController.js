import asyncHandler from "express-async-handler";
import CustomOption from "../models/CustomOption.js";
import CustomProduct from "../models/CustomProduct.js";
import Category from "../models/Category.js";

// @desc    Crear un nuevo modelo de pastel personalizado (Lienzo/Forma)
// @route   POST /api/custom-options/products
const createCustomProductBase = asyncHandler(async (req, res) => {
  const { name, price, images, allowedOptions, shortDescription, shapeType } =
    req.body;

  const miPastelCategory = await Category.findOne({ slug: "mi-pastel" });

  if (!miPastelCategory) {
    res.status(400);
    throw new Error(
      "La categoría 'Mi pastel' no existe. Por favor créala en el panel de categorías."
    );
  }

  const generatedSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const product = await CustomProduct.create({
    name,
    slug: generatedSlug,
    price: Number(price),
    image: images && images.length > 0 ? images[0].url : "",
    images: images || [],
    allowedOptions,
    shortDescription,
    category: miPastelCategory._id,
    shapeType,
  });

  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400);
    throw new Error("Datos de producto inválidos");
  }
});

// @desc    Actualizar modelo de pastel personalizado
// @route   PUT /api/custom-options/products/:id
const updateCustomProductBase = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    images,
    allowedOptions,
    shortDescription,
    shapeType,
    isActive,
  } = req.body;
  const product = await CustomProduct.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price !== undefined ? Number(price) : product.price;
    product.allowedOptions = allowedOptions || product.allowedOptions;
    product.shortDescription = shortDescription || product.shortDescription;
    product.shapeType = shapeType || product.shapeType;

    if (isActive !== undefined) product.isActive = isActive;

    if (images && images.length > 0) {
      product.image = images[0].url;
      product.images = images;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Modelo custom no encontrado");
  }
});

// @desc    Eliminar modelo de pastel personalizado (ESTA FALTABA)
// @route   DELETE /api/custom-options/products/:id
const deleteCustomProductBase = asyncHandler(async (req, res) => {
  const product = await CustomProduct.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: "Modelo de pastel eliminado correctamente" });
  } else {
    res.status(404);
    throw new Error("Modelo de pastel no encontrado");
  }
});

// @desc    Obtener todos los modelos de productos personalizados
const getCustomProducts = asyncHandler(async (req, res) => {
  const products = await CustomProduct.find({ isActive: true }).populate(
    "allowedOptions"
  );
  res.json(products);
});

// @desc    Obtener un modelo por ID
const getCustomProductById = asyncHandler(async (req, res) => {
  const product = await CustomProduct.findById(req.params.id).populate(
    "allowedOptions"
  );
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Producto no encontrado");
  }
});

// --- OPCIONES (Bizcochos, Rellenos, etc.) ---

const createCustomOption = asyncHandler(async (req, res) => {
  const { name, type, basePrice } = req.body;
  const option = await CustomOption.create({ name, type, basePrice });
  res.status(201).json(option);
});

const getCustomOptions = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const filter = type ? { type } : {};
  const options = await CustomOption.find(filter);
  res.json(options);
});

const updateCustomOption = asyncHandler(async (req, res) => {
  const option = await CustomOption.findById(req.params.id);
  if (option) {
    option.name = req.body.name || option.name;
    option.type = req.body.type || option.type;
    option.basePrice =
      req.body.basePrice !== undefined ? req.body.basePrice : option.basePrice;
    const updated = await option.save();
    res.json(updated);
  } else {
    res.status(404);
    throw new Error("Opción no encontrada");
  }
});

const deleteCustomOption = asyncHandler(async (req, res) => {
  const option = await CustomOption.findById(req.params.id);
  if (option) {
    await option.deleteOne();
    res.json({ message: "Opción eliminada" });
  } else {
    res.status(404);
    throw new Error("Opción no encontrada");
  }
});

export {
  createCustomOption,
  getCustomOptions,
  updateCustomOption,
  deleteCustomOption,
  getCustomProducts,
  getCustomProductById,
  createCustomProductBase,
  updateCustomProductBase,
  deleteCustomProductBase, // ✅ Exportada correctamente
};
