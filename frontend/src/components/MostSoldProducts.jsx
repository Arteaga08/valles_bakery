import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, FreeMode } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";

const products = [
  {
    id: 1,
    name: "THE DOUBLE TRUFFLE",
    description:
      "We doubled down on our truffle game for this megapack of bite-sized beauties.",
    tag: "BUNDLE & SAVE $6",
    img1: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    img2: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7",
  },
  {
    id: 2,
    name: "THE MILK BAR SAMPLER",
    description:
      "Have a little bit of everything! This sampler pack of classic Milk Bar treats.",
    tag: "CLASSIC",
    img1: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7",
    img2: "https://milkbarstore.com/cdn/shop/files/MilkBarSampler_2_800x.jpg",
  },
  {
    id: 3,
    name: "MILK BAR® PIE",
    description: "Our signature, gooey Milk Bar Pie has a sticky, buttery...",
    tag: "CLASSIC",
    img1: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    img2: "https://milkbarstore.com/cdn/shop/files/MilkBarPie_2_800x.jpg",
  },
  {
    id: 4,
    name: "THE COOKIE FAVES TIN",
    description: "The Cookie Faves Tin is packed with 3 each of...",
    img1: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7",
    img2: "https://milkbarstore.com/cdn/shop/files/CookieFavesTin_2_800x.jpg",
  },
  {
    id: 5,
    name: "BIRTHDAY CAKE",
    description:
      "You've never tried a birthday cake like this. Our bestselling Birthday Cake.",
    tag: "BEST SELLER",
    img1: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    img2: "https://milkbarstore.com/cdn/shop/files/BirthdayCake_2_800x.jpg",
  },
  {
    id: 6,
    name: "BIRTHDAY CAKE",
    description:
      "You've never tried a birthday cake like this. Our bestselling Birthday Cake.",
    tag: "BEST SELLER",
    img1: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    img2: "https://milkbarstore.com/cdn/shop/files/BirthdayCake_2_800x.jpg",
  },
  {
    id: 7,
    name: "BIRTHDAY CAKE",
    description:
      "You've never tried a birthday cake like this. Our bestselling Birthday Cake.",
    tag: "BEST SELLER",
    img1: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    img2: "https://milkbarstore.com/cdn/shop/files/BirthdayCake_2_800x.jpg",
  },
];

const MostSoldProducts = () => {
  const [showControls, setShowControls] = useState(false);
  const hideTimer = useRef(null);
  const isOverButton = useRef(false); // 👈 Bloqueador para el temporizador

  const cancelHide = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const scheduleHide = () => {
    cancelHide();
    // 🔑 Si el cursor está sobre el botón, no disparamos el cierre
    if (isOverButton.current) return;

    hideTimer.current = setTimeout(() => {
      setShowControls(false);
    }, 1500);
  };

  useEffect(() => {
    return () => cancelHide();
  }, []);

  return (
    <section className="pt-24 pb-16 md:pt-32 bg-white relative overflow-hidden">
      <div className="text-center mb-16 px-6">
        <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 uppercase tracking-tighter">
          Nuestros
        </h2>
        <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 uppercase tracking-tighter">
          <span className="text-new-york-pink">Mas vendidos</span>
        </h2>
        <p className="text-lg text-gray-800 max-w-2xl mx-auto font-medium">
          Iconic layer cakes with unfrosted sides, gooey pie, and fudgy Cake
          Truffles.
        </p>
      </div>

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
            isOverButton.current = true; // Bloquea el temporizador
            setShowControls(true);
            cancelHide();
          }}
          onMouseLeave={() => {
            isOverButton.current = false; // Libera el temporizador
            scheduleHide();
          }}
          className={`prev-p absolute left-0 top-[40%] -translate-y-1/2 z-50 w-12 h-20 bg-[#e64a85]/80 hidden md:flex items-center justify-center text-white transition-all duration-500 hover:bg-[#e64a85] cursor-pointer
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
            isOverButton.current = true; // Bloquea el temporizador
            setShowControls(true);
            cancelHide();
          }}
          onMouseLeave={() => {
            isOverButton.current = false; // Libera el temporizador
            scheduleHide();
          }}
          className={`next-p absolute right-0 top-[40%] -translate-y-1/2 z-50 w-12 h-20 bg-[#e64a85]/80 hidden md:flex items-center justify-center text-white transition-all duration-500 hover:bg-[#e64a85] cursor-pointer
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
          loop={false}
          spaceBetween={20}
          speed={900}
          slidesPerView={1.2}
          centeredSlides={true}
          slidesPerGroup={1}
          // 👈 Espacio lateral aumentado para que no toquen el borde
          slidesOffsetBefore={20}
          slidesOffsetAfter={20}
          navigation={{ nextEl: ".next-p", prevEl: ".prev-p" }}
          scrollbar={{ draggable: true, hide: false }}
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
              // Offset generoso para escritorio
              slidesOffsetBefore: 60,
              slidesOffsetAfter: 60,
              freeMode: { enabled: true, momentum: false },
            },
          }}
          className="pb-24!"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="flex justify-center">
              <div className="group/card cursor-pointer w-full max-w-85 md:max-w-none">
                <div className="relative aspect-4/5 rounded-xl overflow-hidden mb-5 bg-[#f9f3e5]">
                  {product.tag && (
                    <span className="absolute top-4 left-4 z-20 bg-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase text-[#e64a85]">
                      {product.tag}
                    </span>
                  )}
                  <img
                    src={product.img1}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 group-hover/card:opacity-0"
                  />
                  <img
                    src={product.img2}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover/card:opacity-100"
                  />
                </div>
                <div className="px-2">
                  <h3 className="font-black text-[16px] md:text-[18px] uppercase tracking-tight text-gray-900 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .swiper-wrapper {
          transition-timing-function: cubic-bezier(0.25, 1, 0.5, 1) !important;
        }
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
      `}</style>
    </section>
  );
};

export default MostSoldProducts;
