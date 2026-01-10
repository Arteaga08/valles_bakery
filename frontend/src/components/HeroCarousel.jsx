import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { optimizeImage } from "../utils/imageOptimizer.js";

const HeroCarousel = () => {
  const { heroSlides } = useShop();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const displaySlides =
    heroSlides && heroSlides.length > 0
      ? heroSlides
      : [
          {
            imageUrl:
              "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
            title: "Vallée Cupcakes",
            subtitle: "Dulzura artesanal para tu familia.",
          },
        ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. Precarga optimizada: Le pedimos a la función la versión de 1600px también aquí
  useEffect(() => {
    if (displaySlides.length > 1) {
      const nextImg = new Image();
      nextImg.src = optimizeImage(
        displaySlides[(currentIndex + 1) % displaySlides.length].imageUrl,
        1600
      );
    }
  }, [currentIndex, displaySlides]);

  const nextSlide = useCallback(
    () => setCurrentIndex((p) => (p + 1) % displaySlides.length),
    [displaySlides.length]
  );
  const prevSlide = useCallback(
    () =>
      setCurrentIndex(
        (p) => (p - 1 + displaySlides.length) % displaySlides.length
      ),
    [displaySlides.length]
  );

  return (
    <section className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden bg-[#FAF7F2]">
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.img
            key={currentIndex}
            // 3. Aplicamos la optimización aquí con ancho de 1600 para alta calidad
            src={optimizeImage(displaySlides[currentIndex].imageUrl, 1600)}
            alt={
              displaySlides[currentIndex].title || "Pastelería artesanal Vallée"
            }
            loading="eager"
            fetchpriority="high"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 flex items-center justify-center md:justify-start px-4 md:px-20 z-20 pointer-events-none">
        <div
          className="bg-new-york-pink/60 border border-white/30 shadow-2xl pointer-events-auto relative 
                     w-85 h-112.5 md:w-120 md:h-130 transition-all duration-500"
          style={{
            clipPath: isMobile
              ? "none"
              : "polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%)",
            borderRadius: isMobile ? "40px" : "0px",
          }}
        >
          <div className="absolute inset-0 p-10 md:p-14 flex flex-col justify-between items-center md:items-start text-center md:text-left">
            <div className="w-full mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-4xl md:text-6xl font-bold font-fraunces mb-4 text-black-bean leading-none">
                    {displaySlides[currentIndex].title}
                  </h2>
                  <p className="text-lg md:text-xl font-medium italic text-black-bean/90">
                    {displaySlides[currentIndex].subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="w-full">
              <button className="bg-black-bean text-white px-10 py-3 rounded-full font-bold tracking-widest text-[10px] mb-8 hover:bg-black-bean/90 transition-all">
                DESCUBRIR
              </button>

              <div className="flex gap-4 justify-center md:justify-start">
                <button
                  onClick={prevSlide}
                  className="p-2.5 bg-white/20 hover:bg-black-bean hover:text-white text-black-bean rounded-full transition-all hide-arrows-mobile"
                  aria-label="Ir a la diapositiva anterior"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2.5 bg-white/20 hover:bg-black-bean hover:text-white text-black-bean rounded-full transition-all hide-arrows-mobile"
                  aria-label="Ir a la diapositiva siguiente"
                >
                  <ChevronRight size={18} />
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
