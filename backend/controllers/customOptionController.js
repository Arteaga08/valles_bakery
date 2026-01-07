import CustomOption from "../models/CustomOption.js";
import CustomProduct from "../models/CustomProduct.js"; // ✅ Importante: Usaremos este para los lienzos
import asyncHandler from "express-async-handler";

// ==========================================
// CONTROLADORES PARA OPCIONES (Ingredientes/Extras)
// ==========================================
// (Estos se quedan igual, manejan la tabla 'customoptions')

const createCustomOption = asyncHandler(async (req, res) => {
  const { type, name, basePrice, image } = req.body;

  if (!type || !name) {
    res.status(400);
    throw new Error("Please include option type and name.");
  }

  const allowedTypes = [
    "Size",
    "Filling",
    "Shape",
    "Flavor",
    "Decoration",
    "Extra",
  ];
  if (!allowedTypes.includes(type)) {
    res.status(400);
    throw new Error(`El tipo "${type}" no es válido.`);
  }

  const option = await CustomOption.create({
    type,
    name,
    basePrice: basePrice || 0.0,
    image,
  });

  res.status(201).json(option);
});

const getCustomOptions = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.type) {
    filter.type = req.query.type;
  }
  const options = await CustomOption.find(filter).sort({ type: 1, name: 1 });
  res.status(200).json(options);
});

const updateCustomOption = asyncHandler(async (req, res) => {
  const { type, name, basePrice, image, isActive } = req.body;
  const option = await CustomOption.findById(req.params.id);

  if (option) {
    option.type = type || option.type;
    option.name = name || option.name;
    option.basePrice = basePrice !== undefined ? basePrice : option.basePrice;
    option.image = image || option.image;
    option.isActive = isActive !== undefined ? isActive : option.isActive;

    const updatedOption = await option.save();
    res.json(updatedOption);
  } else {
    res.status(404);
    throw new Error("Custom Option not found");
  }
});

const deleteCustomOption = asyncHandler(async (req, res) => {
  const option = await CustomOption.findById(req.params.id);
  if (option) {
    await CustomOption.deleteOne({ _id: option._id });
    res.json({ message: "Custom Option removed" });
  } else {
    res.status(404);
    throw new Error("Custom Option not found");
  }
});

// ==========================================
// CONTROLADORES PARA PRODUCTOS BASE (Lienzos/Formas)
// ==========================================
// AQUÍ ESTABAN LOS ERRORES. AHORA USAN CustomProduct (Tabla separada)

// @desc    Get only Custom Products for the Admin Table
const getCustomProducts = asyncHandler(async (req, res) => {
  // ✅ CORREGIDO: Usamos CustomProduct.find.
  // Ya no filtramos por type="Shape" porque esta tabla SOLO tiene productos custom.
  const products = await CustomProduct.find({})
    .populate("allowedOptions") // Opcional: para ver los nombres de los ingredientes
    .sort({ createdAt: -1 });
  res.json(products);
});

// @desc    Create a base Custom Product
const createCustomProductBase = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    price,
    images,
    allowedOptions,
    shortDescription,
    shapeType,
  } = req.body;

  // ✅ CORREGIDO: Usamos CustomProduct.create
  // Esto asegura que vaya a la colección 'customproducts' y no a 'customoptions'
  const product = await CustomProduct.create({
    name,
    slug: slug || name?.toLowerCase().replace(/ /g, "-"), // Generamos slug si no viene
    price: Number(price), // CustomProduct usa 'price', no 'basePrice'
    image: images[0]?.url || "",
    shapeType,
    allowedOptions,
    shortDescription,
    isActive: true,
  });

  res.status(201).json(product);
});

// @desc    Update a base Custom Product
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

  // ✅ CORREGIDO CRÍTICO: Antes decías 'Product.findById' (que no existía).
  // Ahora usamos CustomProduct.findById
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
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Modelo custom no encontrado");
  }
});

export {
  createCustomOption,
  getCustomOptions,
  updateCustomOption,
  deleteCustomOption,
  getCustomProducts,
  createCustomProductBase,
  updateCustomProductBase,
};
