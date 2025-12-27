import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, FreeMode } from "swiper/modules";
import API from "../service/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

const MostSoldProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showControls, setShowControls] = useState(false);
  const hideTimer = useRef(null);
  const isOverButton = useRef(false);

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get("/products");
        // Solo los más vendidos
        const bestSellers = data.filter((p) => p.isBestSeller);
        setProducts(bestSellers);
      } catch (error) {
        console.error("Error loading products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ---------------- CONTROLS ---------------- */
  const cancelHide = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const scheduleHide = () => {
    cancelHide();
    if (isOverButton.current) return;

    hideTimer.current = setTimeout(() => {
      setShowControls(false);
    }, 1500);
  };

  useEffect(() => () => cancelHide(), []);

  if (loading || products.length === 0) return null;

  return (
    <section className="pt-24 pb-16 md:pt-32 bg-white relative overflow-hidden">
      {/* HEADER */}
      <div className="text-center mb-16 px-6">
        <h2 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter">
          Nuestros más
        </h2>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
          <span className="text-new-york-pink">Vendidos</span>
        </h2>
        <p className="text-lg text-gray-800 max-w-2xl mx-auto font-medium">
          Iconic layer cakes with unfrosted sides, gooey pie, and fudgy Cake
          Truffles.
        </p>
      </div>

      {/* CAROUSEL */}
      <div
        className="relative w-full max-w-400 mx-auto"
        onMouseMove={() => {
          setShowControls(true);
          scheduleHide();
        }}
      >
        {/* PREV */}
        <button
          onMouseEnter={() => {
            isOverButton.current = true;
            setShowControls(true);
            cancelHide();
          }}
          onMouseLeave={() => {
            isOverButton.current = false;
            scheduleHide();
          }}
          className={`prev-p absolute left-0 top-[40%] -translate-y-1/2 z-50 w-12 h-20 bg-[#e64a85]/80 hidden md:flex items-center justify-center text-white transition-all duration-500 hover:bg-[#e64a85]
          ${
            showControls
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-full"
          }`}
        >
          <ChevronLeft size={32} strokeWidth={3} />
        </button>

        {/* NEXT */}
        <button
          onMouseEnter={() => {
            isOverButton.current = true;
            setShowControls(true);
            cancelHide();
          }}
          onMouseLeave={() => {
            isOverButton.current = false;
            scheduleHide();
          }}
          className={`next-p absolute right-0 top-[40%] -translate-y-1/2 z-50 w-12 h-20 bg-[#e64a85]/80 hidden md:flex items-center justify-center text-white transition-all duration-500 hover:bg-[#e64a85]
          ${
            showControls
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-full"
          }`}
        >
          <ChevronRight size={32} strokeWidth={3} />
        </button>

        <Swiper
          modules={[Navigation, Scrollbar, FreeMode]}
          spaceBetween={20}
          speed={900}
          slidesPerView={1.2}
          centeredSlides
          slidesOffsetBefore={20}
          slidesOffsetAfter={20}
          navigation={{ nextEl: ".next-p", prevEl: ".prev-p" }}
          scrollbar={{ draggable: true }}
          breakpoints={{
            640: {
              slidesPerView: 2.3,
              centeredSlides: false,
              slidesOffsetBefore: 40,
              slidesOffsetAfter: 40,
            },
            1024: {
              slidesPerView: 4.5,
              centeredSlides: false,
              slidesOffsetBefore: 60,
              slidesOffsetAfter: 60,
              freeMode: { enabled: true, momentum: false },
            },
          }}
          className="pb-24!"
        >
          {products.map((product) => {
            const mainImg = product.images.find((i) => i.isMain)?.url;
            const hoverImg = product.images.find((i) => !i.isMain)?.url;

            return (
              <SwiperSlide key={product._id} className="flex justify-center">
                <div className="group/card cursor-pointer w-full max-w-85 md:max-w-none">
                  <div className="relative aspect-4/5 rounded-xl overflow-hidden mb-5 bg-[#f9f3e5]">
                    {product.tags?.[0] && (
                      <span className="absolute top-4 left-4 z-20 bg-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase text-[#e64a85]">
                        {product.tags[0]}
                      </span>
                    )}

                    <img
                      src={mainImg}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 group-hover/card:opacity-0"
                    />
                    {hoverImg && (
                      <img
                        src={hoverImg}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover/card:opacity-100"
                      />
                    )}
                  </div>

                  <div className="px-2">
                    <h3 className="font-black text-[16px] md:text-[18px] uppercase tracking-tight text-gray-900 mb-1">
                      {product.name}
                    </h3>

                    {/* PRECIO */}
                    <p className="text-[15px] font-semibold text-new-york-pink mb-1">
                      ${product.price.toFixed(2)} MXN
                    </p>

                    <p className="text-sm text-gray-700 line-clamp-2">
                      {product.shortDescription}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <style jsx global>{`
  .swiper-scrollbar {
    background: #f1f1f1 !important;
    height: 4px !important;
    bottom: 10px !important;
    width: 80% !important;
    left: 10% !important;
    border-radius: 10px;
  }
  .swiper-scrollbar-drag {
    background: #e64a85 !important;
    border-radius: 10px;
    transition: transform 0.9s cubic-bezier(0.25, 1, 0.5, 1) !important;
  }
  /* Estilo opcional para que la transición de imágenes sea más suave */
  .group-hover\/card\:opacity-100 {
    transition: opacity 0.7s ease-in-out;
  }
`}</style>
      </div>
    </section>
  );
};

export default MostSoldProducts;
