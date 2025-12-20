import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import API from "../service/api";

const HeroCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil para cambiar la forma dinámicamente
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Ejecutar al inicio
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const { data } = await API.get("/hero-slides");
        if (data && data.length > 0) {
          data.forEach((s) => {
            const img = new Image();
            img.src = s.imageUrl;
          });
          setSlides(data);
        } else {
          setSlides([
            {
              imageUrl:
                "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
              title: "Vallée Cupcakes",
              subtitle: "Dulzura artesanal para tu familia.",
            },
            {
              imageUrl:
                "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7",
              title: "Eventos",
              subtitle: "Momentos mágicos llenos de sabor.",
            },
          ]);
        }
      } catch (error) {
        console.error("Error");
      }
    };
    fetchHeroImages();
  }, []);

  const nextSlide = () => setCurrentIndex((p) => (p + 1) % slides.length);
  const prevSlide = () =>
    setCurrentIndex((p) => (p - 1 + slides.length) % slides.length);

  if (slides.length === 0) return null;

  return (
    <section className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden bg-stone-100">
      {/* 1. FONDO: Capas superpuestas */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.img
            key={currentIndex}
            src={slides[currentIndex].imageUrl}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* 2. LA FORMA ROSA: Condicional para simetría */}
      <div className="absolute inset-0 flex items-center justify-center md:justify-start px-4 md:px-20 z-20 pointer-events-none">
        <div
          className="bg-new-york-pink/60 border border-white/30 shadow-2xl pointer-events-auto relative 
                     w-85 h-112.5 md:w-120 md:h-130 transition-all duration-500"
          style={{
            // Si es móvil: Rectángulo perfecto (none). Si es Desktop: Flecha.
            clipPath: isMobile
              ? "none"
              : "polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%)",
            borderRadius: isMobile ? "40px" : "0px", // Bordes suaves en móvil
          }}
        >
          {/* 3. CONTENIDO INTERNO */}
          <div className="absolute inset-0 p-10 md:p-14 flex flex-col justify-between items-center md:items-start text-center md:text-left">
            <div className="w-full mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h2 className="text-4xl md:text-6xl font-bold font-fraunces mb-4 text-black-bean">
                    {slides[currentIndex].title}
                  </h2>
                  <p className="text-lg md:text-xl font-medium italic text-black-bean opacity-95">
                    {slides[currentIndex].subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="w-full">
              <button className="bg-black-bean text-white px-10 py-3 rounded-full font-bold tracking-widest text-xs mb-8 hover:scale-105 transition-transform">
                DESCUBRIR
              </button>

              <div className="flex gap-4 justify-center md:justify-start">
                <button
                  onClick={prevSlide}
                  className="p-2.5 bg-white/30 hover:bg-black-bean hover:text-white text-black-bean rounded-full transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2.5 bg-white/30 hover:bg-black-bean hover:text-white text-black-bean rounded-full transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
