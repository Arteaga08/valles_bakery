import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Heater, Gift } from "lucide-react";
import API from "../service/api";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/slug/${slug}`);
        setProduct(res.data);
        const initialImg =
          res.data.images.find((img) => img.isMain)?.url ||
          res.data.images[0]?.url;
        setMainImage(initialImg);
        if (res.data.sizes && res.data.sizes.length > 0) {
          setSelectedSize(res.data.sizes[0]);
        }
      } catch (error) {
        console.error("Error al cargar producto", error);
      }
    };
    fetchProduct();
  }, [slug]);

  if (!product)
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAF7F2] text-black-bean">
        Cargando Vallée...
      </div>
    );

  const totalPrice =
    product.price + (selectedSize ? selectedSize.priceAdjustment : 0);

  return (
    <div className="bg-[#FAF7F2] min-h-screen pt-28 pb-20 px-4 md:px-12">
      <div className="max-w-325 mx-auto">
        {/* BOTÓN VOLVER - Uso de Black Bean */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-black-bean font-black uppercase text-[10px] tracking-widest mb-10 hover:text-[#D97E8A] transition-colors"
        >
          <ArrowLeft size={14} /> Volver al menú
        </button>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* COLUMNA IZQUIERDA: GALERÍA */}
          <div className="lg:w-1/2">
            <div className="relative aspect-square rounded-[40px] overflow-hidden bg-white shadow-sm border border-black-bean/5">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* BADGE "MOST POPULAR" - Fondo New York Pink, Texto Baby Pink */}
              {product.isBestSeller && (
                <div className="absolute top-6 right-6 bg-[#D97E8A] text-[#E7C0BC] px-4 py-4 rounded-full text-[10px] font-black uppercase text-center leading-none shadow-xl transform rotate-12 border-2 border-[#E7C0BC]">
                  Most
                  <br />
                  Popular
                </div>
              )}
            </div>

            {/* MINIATURAS - Bordes en New York Pink */}
            <div className="flex gap-4 mt-6">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img.url)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    mainImage === img.url
                      ? "border-[#D97E8A]"
                      : "border-transparent opacity-50"
                  }`}
                >
                  <img src={img.url} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* COLUMNA DERECHA: INFO */}
          <div className="lg:w-1/2 flex flex-col pt-4">
            <h1 className="text-5xl md:text-6xl font-serif text-black-bean mb-6 leading-tight">
              {product.name}
            </h1>

            <p className="text-black-bean opacity-80 text-lg leading-relaxed mb-10 font-medium max-w-xl">
              {product.longDescription || product.shortDescription}
            </p>

            {/* SELECCIÓN DE TAMAÑOS - Baby Pink y New York Pink */}
            <div className="mb-12">
              <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-black-bean mb-6">
                PACK SIZE
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {product.sizes.map((size, idx) => {
                  const isSelected = selectedSize?.name === size.name;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(size)}
                      className={`flex flex-col p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                        isSelected
                          ? "border-[#D97E8A] bg-[#E7C0BC] shadow-md -translate-y-1"
                          : "border-black-bean/10 bg-white text-black-bean hover:border-[#E7C0BC]"
                      }`}
                    >
                      <span
                        className={`text-xl font-black uppercase tracking-tight mb-1 ${
                          isSelected ? "text-black-bean" : "text-black-bean"
                        }`}
                      >
                        {size.name}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          isSelected
                            ? "text-black-bean/70"
                            : "text-black-bean/40"
                        }`}
                      >
                        ${product.price + size.priceAdjustment}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BOTÓN AGREGAR - Fondo Black Bean, Texto Baby Pink */}
            <button className="w-full bg-black-bean text-[#E7C0BC] py-6 rounded-3xl text-[14px] font-black uppercase tracking-[0.2em] hover:bg-[#D97E8A] hover:text-white transition-all duration-500 shadow-2xl flex items-center justify-center gap-4 group">
              <ShoppingBag
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              Agregar al carrito — ${totalPrice}
            </button>

            {/* DETALLES EXTRA - Iconos en New York Pink */}
            <div className="mt-12 grid grid-cols-2 gap-4 border-t border-black-bean/10 pt-10">
              {/* Baked To Order */}
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#E7C0BC]/30 flex items-center justify-center text-[#D97E8A]">
                  <Heater size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-black-bean">
                    Horneado con Amor
                  </h4>
                  <p className="text-[11px] text-black-bean/60 font-medium max-w-35">
                    Fresco de nuestro horno a tu mesa.
                  </p>
                </div>
              </div>

              {/* Gift-Wrapped */}
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#E7C0BC]/30 flex items-center justify-center text-[#D97E8A]">
                  <Gift size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-black-bean">
                    Empaquetado con cariño
                  </h4>
                  <p className="text-[11px] text-black-bean/60 font-medium max-w-35">
                    Empaque premium de regalo incluido.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
