import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ArrowLeft,
  Heater,
  Gift,
  Check,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import API from "../service/api";

const CustomCakeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [selections, setSelections] = useState({
    Size: null,
    Flavor: null,
    Filling: null,
    Decoration: [],
  });
  const [totalPrice, setTotalPrice] = useState(0);

  const labelsMap = {
    Size: "Tamaño",
    Flavor: "Bizcocho",
    Filling: "Relleno",
    Decoration: "Extras",
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/custom-options/products/${id}`);
        setProduct(data);
        setTotalPrice(data.price);
        setMainImage(data.image);
      } catch (err) {
        console.error("Error cargando producto custom", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  useEffect(() => {
    if (!product) return;
    const base = product.price || 0;
    const extraPrice = Object.entries(selections).reduce(
      (acc, [key, value]) => {
        if (!value) return acc;
        if (key === "Decoration") {
          return (
            acc + value.reduce((sum, item) => sum + (item.basePrice || 0), 0)
          );
        }
        return acc + (value.basePrice || 0);
      },
      0
    );
    setTotalPrice(base + extraPrice);
  }, [selections, product]);

  const handleSelect = (type, item) => {
    setSelections((prev) => {
      if (type === "Decoration") {
        const exists = prev.Decoration.find((i) => i._id === item._id);
        return {
          ...prev,
          Decoration: exists
            ? prev.Decoration.filter((i) => i._id !== item._id)
            : [...prev.Decoration, item],
        };
      }
      return { ...prev, [type]: item };
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    const customDetails = {
      tamaño: selections.Size?.name,
      bizcocho: selections.Flavor?.name,
      relleno: selections.Filling?.name,
      decoracion:
        selections.Decoration.length > 0
          ? selections.Decoration.map((d) => d.name).join(", ")
          : "Estándar",
      selectionIds: {
        size: selections.Size?._id,
        flavor: selections.Flavor?._id,
        filling: selections.Filling?._id,
        decoration: selections.Decoration.map((d) => d._id),
      },
    };
    addToCart(product, customDetails, totalPrice);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const renderSection = (type, label) => {
    const filtered =
      product.allowedOptions?.filter((o) => o.type === type) || [];
    if (filtered.length === 0) return null;

    return (
      <div className="mb-10">
        <div className="flex justify-between items-end mb-5">
          <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-black-bean">
            {label}
          </h3>
          {(type === "Decoration"
            ? selections.Decoration.length > 0
            : selections[type]) && (
            <span className="text-[10px] font-bold text-[#D97E8A] flex items-center gap-1">
              <CheckCircle2 size={12} /> SELECCIONADO
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const isSelected =
              type === "Decoration"
                ? selections.Decoration.some((i) => i._id === item._id)
                : selections[type]?._id === item._id;
            return (
              <button
                key={item._id}
                onClick={() => handleSelect(type, item)}
                className={`flex flex-col p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                  isSelected
                    ? "border-[#D97E8A] bg-[#E7C0BC] shadow-md -translate-y-1"
                    : "border-black-bean/10 bg-white text-black-bean hover:border-[#E7C0BC]"
                }`}
              >
                <span className="text-xl font-black uppercase tracking-tight mb-1">
                  {item.name}
                </span>
                <span
                  className={`text-xs font-bold ${
                    isSelected ? "text-black-bean/70" : "text-[#D97E8A]"
                  }`}
                >
                  {item.basePrice > 0 ? `+$${item.basePrice}` : "Incluido"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAF7F2] text-black-bean font-serif italic text-xl">
        Cargando Vallée...
      </div>
    );

  return (
    <div className="bg-white-soft min-h-screen pt-8 pb-20 px-4 md:px-12 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-black-bean font-black uppercase text-[10px] tracking-widest mb-10 hover:text-[#D97E8A] transition-colors group"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Volver al menú
        </button>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* COLUMNA IZQUIERDA: GALERÍA */}
          <div className="lg:w-1/2">
            <div className="relative aspect-square rounded-[40px] overflow-hidden bg-white shadow-sm border border-black-bean/5">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
              />
            </div>

            <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
              {product.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img.url)}
                  className={`w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                    mainImage === img.url
                      ? "border-[#D97E8A] scale-95"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    className="w-full h-full object-cover"
                    alt={`Vista ${idx}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* COLUMNA DERECHA: INFO Y EXTRAS */}
          <div className="lg:w-1/2 flex flex-col pt-4">
            <h1 className="text-5xl md:text-6xl font-serif text-black-bean mb-6 leading-tight">
              {product.name}
            </h1>

            <p className="text-black-bean/80 text-lg leading-relaxed mb-10 font-medium max-w-xl">
              {product.shortDescription || "Un diseño único creado por ti."}
            </p>

            {/* SECCIONES DE PERSONALIZACIÓN */}
            <div className="space-y-2">
              {renderSection("Size", "PACK SIZE")}
              {renderSection("Flavor", "BIZCOCHO")}
              {renderSection("Filling", "RELLENO")}
              {renderSection("Decoration", "EXTRAS")}
            </div>

            {/* BOTÓN AGREGAR */}
            <button
              onClick={handleAddToCart}
              disabled={
                !selections.Size ||
                !selections.Flavor ||
                !selections.Filling ||
                isAdded
              }
              className={`w-full py-6 rounded-3xl text-[14px] font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl flex items-center justify-center gap-4 group active:scale-95 mt-10 ${
                isAdded
                  ? "bg-[#D1EAD8] text-[#1F412E]"
                  : "bg-black-bean text-[#E7C0BC] hover:bg-[#D97E8A] hover:text-white disabled:opacity-20 disabled:grayscale"
              }`}
            >
              {isAdded ? (
                <>
                  <Check size={20} className="animate-in zoom-in" />
                  ¡Añadido con éxito!
                </>
              ) : (
                <>
                  <ShoppingBag
                    size={20}
                    className="group-hover:scale-110 transition-transform"
                  />
                  Agregar al carrito — ${totalPrice.toLocaleString()}
                </>
              )}
            </button>

            {/* DETALLES EXTRA (Igual que producto normal) */}
            <div className="mt-12 grid grid-cols-2 gap-4 border-t border-black-bean/10 pt-10">
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

export default CustomCakeDetail;
