import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FavoritesWheel = ({ products = [] }) => {
  const [position, setPosition] = useState(0);

  if (!products || products.length === 0) return null;

  const handleNext = () => {
    setPosition((prev) => (prev + 1) % products.length);
  };

  const handleBack = () => {
    setPosition((prev) => (prev - 1 + products.length) % products.length);
  };

  const getPositions = (index) => {
    const diff = (index - position + products.length) % products.length;
    if (diff === 0) return "center";
    if (diff === 1) return "right";
    if (diff === products.length - 1) return "left";
    return "hidden";
  };

  const variants = {
    center: { x: "0%", scale: 1.1, zIndex: 10, opacity: 1 },
    left: { x: "-65%", scale: 0.7, zIndex: 5, opacity: 0.4 },
    right: { x: "65%", scale: 0.7, zIndex: 5, opacity: 0.4 },
    hidden: { x: "0%", scale: 0, zIndex: 0, opacity: 0 },
  };

  return (
    <section className="py-24 bg-white-soft overflow-hidden flex flex-col items-center">
      <h2 className="text-4xl md:text-5xl font-bold font-fraunces text-black-bean mb-24">
        LO MÁS <span className="text-new-york-pink">VENDIDO</span> ⭐
      </h2>

      <div className="relative w-full max-w-5xl h-100 flex items-center justify-center">
        <AnimatePresence initial={false}>
          {products.map((product, index) => {
            const pos = getPositions(index);
            if (pos === "hidden") return null;

            return (
              <motion.div
                key={product._id}
                initial="hidden"
                animate={pos}
                variants={variants}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute w-70 md:w-95 flex flex-col items-center"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain drop-shadow-2xl mb-8"
                />

                {pos === "center" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center absolute -bottom-32 w-full"
                  >
                    <h3 className="text-2xl font-bold text-black-bean font-fraunces uppercase tracking-tight">
                      {product.name}
                    </h3>
                    <p className="text-new-york-pink font-bold text-2xl mt-1">
                      ${product.price}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex gap-6 mt-32">
        <button
          onClick={handleBack}
          className="p-3 rounded-full border border-new-york-pink text-new-york-pink hover:bg-new-york-pink hover:text-white transition-all"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={handleNext}
          className="p-3 rounded-full border border-new-york-pink text-new-york-pink hover:bg-new-york-pink hover:text-white transition-all"
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </section>
  );
};

export default FavoritesWheel;
