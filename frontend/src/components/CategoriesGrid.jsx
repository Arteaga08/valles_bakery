import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import { useShop } from "../context/ShopContext";
import { optimizeImage } from "../utils/imageOptimizer.js";

import "swiper/css";
import "swiper/css/scrollbar";

const CategoriesGrid = () => {
  const { categories, loading } = useShop();

  const placeholders = [
    "https://images.unsplash.com/photo-1571115177098-24ec42ed204d",
    "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec",
    "https://images.unsplash.com/photo-1558961363-fa8fdf82db35",
    "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
  ];

  // CLS FIX: En lugar de null, renderizamos la sección vacía con su altura mínima
  // Esto mantiene el espacio reservado y el color de fondo mientras cargan los datos.
  if (loading) {
    return (
      <section className="py-24 px-6 bg-new-york-pink min-h-175 md:min-h-212.5" />
    );
  }

  return (
    <section className="py-24 px-6 bg-new-york-pink overflow-hidden min-h-175 md:min-h-212.5">
      <div className="max-w-350 mx-auto text-center">
        <header className="mb-14">
          <h2 className="text-5xl md:text-6xl font-serif text-[#1F412E] mb-4">
            Categorías
          </h2>
          <p className="text-lg text-[#1F412E] font-medium opacity-90 max-w-2xl mx-auto">
            Para cualquier día festivo, ocasión especial o motivo de
            celebración.
          </p>
        </header>

        <Swiper
          modules={[Scrollbar]}
          spaceBetween={20}
          slidesPerView={1.2}
          centeredSlides={true}
          slidesPerGroup={1}
          grabCursor={true}
          scrollbar={{ draggable: true, hide: false }}
          breakpoints={{
            1024: {
              slidesPerView: 4,
              spaceBetween: 40,
              centeredSlides: false,
              allowTouchMove: false,
            },
          }}
          className="categories-swiper pb-24!"
        >
          {categories.slice(0, 4).map((cat, index) => (
            <SwiperSlide key={cat._id}>
              <Link
                to={`/productos?categoria=${
                  cat.slug || cat.name.toLowerCase()
                }`}
                className="group flex flex-col items-center w-full"
                aria-label={`Ver productos de la categoría ${cat.name}`}
              >
                {/* CLS FIX: Contenedor con aspecto definido */}
                <div className="relative w-full aspect-square overflow-hidden bg-white/20 mb-6 rounded-sm shadow-sm">
                  <img
                    src={optimizeImage(
                      cat.imageUrl || placeholders[index % placeholders.length],
                      700
                    )}
                    alt={`Colección de ${cat.name} - Vallée`}
                    // CLS FIX: Atributos de tamaño explícitos para que el navegador reserve el espacio
                    width="400"
                    height="400"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
                <h3 className="text-2xl font-serif text-[#1F412E] group-hover:opacity-60 transition-opacity">
                  {cat.name}
                </h3>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .swiper-scrollbar {
          height: 4px !important;
          background: rgba(0, 0, 0, 0.1) !important;
          border-radius: 10px !important;
        }
        .swiper-scrollbar-drag {
          background: #e64a85 !important;
          border-radius: 10px !important;
        }
        .categories-swiper .swiper-scrollbar {
          width: 60% !important;
          left: 20% !important;
          bottom: 20px !important;
        }
        @media (min-width: 1024px) {
          .categories-swiper .swiper-scrollbar {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default CategoriesGrid;
