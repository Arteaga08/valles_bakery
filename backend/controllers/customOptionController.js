import CustomOption from "../models/CustomOption.js";
import asyncHandler from "express-async-handler";

// @desc    Create a new Custom Option
// @route   POST /api/custom-options
// @access  Private (Admin only)
const createCustomOption = asyncHandler(async (req, res) => {
  const { type, name, basePrice, image } = req.body;

  if (!type || !name) {
    res.status(400);
    throw new Error("Please include option type and name.");
  }

  const option = await CustomOption.create({
    type,
    name,
    basePrice: basePrice || 0.0,
    image,
  });

  res.status(201).json(option);
});

// @desc    Get all Custom Options
// @route   GET /api/custom-options
// @access  Public
const getCustomOptions = asyncHandler(async (req, res) => {
  const filter = { isActive: true };

  if (req.query.type) {
    filter.type = req.query.type;
  }

  const options = await CustomOption.find(filter).sort({ type: 1, name: 1 });
  res.status(200).json(options);
});

// @desc    Update Custom Option
// @route   PUT /api/custom-options/:id
// @access  Private (Admin only)
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

// @desc    Delete Custom Option
// @route   DELETE /api/custom-options/:id
// @access  Private (Admin only)
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

export {
  createCustomOption,
  getCustomOptions,
  updateCustomOption, // Exportada
  deleteCustomOption,
};