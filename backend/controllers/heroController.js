import HeroSlide from "../models/HeroSlide.js";

// @desc    Obtener todos los slides
// @route   GET /api/hero-slides
export const getHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1 });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Crear un slide
// @route   POST /api/hero-slides
export const createHeroSlide = async (req, res) => {
  try {
    const { imageUrl, title, subtitle, order, public_id } = req.body;
    const slide = new HeroSlide({
      imageUrl,
      title,
      subtitle,
      order,
      public_id,
    });
    const createdSlide = await slide.save();
    res.status(201).json(createdSlide);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Eliminar un slide
// @route   DELETE /api/hero-slides/:id
export const deleteHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (slide) {
      await slide.deleteOne();
      res.json({ message: "Slide eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Slide no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
