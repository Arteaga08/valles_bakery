import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

const HeroCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. Obtener imágenes del backend (Cloudinary URLs)
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const { data } = await API.get("/hero-slides"); // Ruta que crearemos en el backend
        setSlides(data);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando el Hero:", error);
        setLoading(false);
      }
    };
    fetchHeroImages();
  }, []);

  // 2. Auto-play del carrusel
  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides]);

  if (loading || slides.length === 0)
    return <div className="h-[70vh] bg-white-soft animate-pulse" />;

  return (
    <section className="relative h-[75vh] md:h-[85vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Imagen de Cloudinary con overlay sutil */}
          <div className="absolute inset-0 bg-black-bean/20 z-10" />
          <img
            src={slides[currentIndex].imageUrl}
            alt={slides[currentIndex].title}
            className="w-full h-full object-cover"
          />

          {/* Texto dinámico con Fraunces */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white-soft text-5xl md:text-7xl font-bold mb-4 drop-shadow-md"
            >
              {slides[currentIndex].title}
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-baby-pink text-lg md:text-2xl font-medium italic"
            >
              {slides[currentIndex].subtitle}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Indicadores de posición (Puntos) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentIndex ? "w-8 bg-new-york-pink" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
