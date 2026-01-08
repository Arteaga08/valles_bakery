import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, ShoppingBag, CheckCircle2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import API from "../service/api";

const CustomCakeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);
  const [mainImage, setMainImage] = useState(""); // Para controlar la foto grande

  const [selections, setSelections] = useState({
    Size: null,
    Flavor: null,
    Filling: null,
    Decoration: [], // ✅ Cambiado a Array para selección múltiple
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
        setMainImage(data.image); // Imagen inicial
      } catch (err) {
        console.error("Error cargando producto custom", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  // Cálculo de precio corregido para múltiples extras
  useEffect(() => {
    if (!product) return;
    const base = product.price || 0;

    const extraPrice = Object.entries(selections).reduce(
      (acc, [key, value]) => {
        if (!value) return acc;

        if (key === "Decoration") {
          // Sumamos todos los extras del array
          return (
            acc + value.reduce((sum, item) => sum + (item.basePrice || 0), 0)
          );
        }

        // Secciones de selección única
        return acc + (value.basePrice || 0);
      },
      0
    );

    setTotalPrice(base + extraPrice);
  }, [selections, product]);

  const handleSelect = (type, item) => {
    setSelections((prev) => {
      if (type === "Decoration") {
        // Lógica de Toggle para selección múltiple
        const exists = prev.Decoration.find((i) => i._id === item._id);
        return {
          ...prev,
          Decoration: exists
            ? prev.Decoration.filter((i) => i._id !== item._id) // Si ya existe, quitarlo
            : [...prev.Decoration, item], // Si no existe, agregarlo
        };
      }
      // Selección única normal
      return { ...prev, [type]: item };
    });
  };

  const handleAddToCart = () => {
    if (!product) return;

    const customDetails = {
      tamaño: selections.Size?.name,
      bizcocho: selections.Flavor?.name,
      relleno: selections.Filling?.name,
      // Concatenamos los nombres de los extras para el carrito
      decoracion:
        selections.Decoration.length > 0
          ? selections.Decoration.map((d) => d.name).join(", ")
          : "Estándar",
      selectionIds: {
        size: selections.Size?._id,
        flavor: selections.Flavor?._id,
        filling: selections.Filling?._id,
        decoration: selections.Decoration.map((d) => d._id), // Enviamos array de IDs
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
          <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-[#1F412E]">
            {label} {type === "Decoration" && "(Múltiple)"}
          </h3>
          {(type === "Decoration"
            ? selections.Decoration.length > 0
            : selections[type]) && (
            <span className="text-[10px] font-bold text-[#D97E8A] flex items-center gap-1 animate-fadeIn">
              <CheckCircle2 size={12} /> SELECCIONADO
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((item) => {
            // Verificamos si está seleccionado (comparando ID o buscando en array)
            const isSelected =
              type === "Decoration"
                ? selections.Decoration.some((i) => i._id === item._id)
                : selections[type]?._id === item._id;

            return (
              <button
                key={item._id}
                onClick={() => handleSelect(type, item)}
                className={`group p-5 rounded-2xl border-2 transition-all duration-300 text-left flex flex-col justify-between ${
                  isSelected
                    ? "border-[#D97E8A] bg-[#E7C0BC] shadow-md -translate-y-1"
                    : "border-[#1F412E]/10 bg-white hover:border-[#D97E8A]"
                }`}
              >
                <span className="text-[13px] font-black uppercase tracking-tight text-[#1F412E]">
                  {item.name}
                </span>
                <span
                  className={`text-[11px] font-bold mt-1 ${
                    isSelected ? "text-[#1F412E]/70" : "text-[#D97E8A]"
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
      <div className="h-screen flex flex-col items-center justify-center bg-[#FAF7F2]">
        <Loader2 className="animate-spin text-[#D97E8A] mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-[#1F412E]">
          Cargando Vallée...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-white pt-8 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1F412E] hover:text-[#D97E8A] transition-colors"
        >
          <ArrowLeft size={14} /> Volver al Menú
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* LADO IZQUIERDO: VISUAL / GALERÍA */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="relative">
              <div className="aspect-square bg-[#FAF7F2] rounded-[40px] overflow-hidden border border-[#1F412E]/5 shadow-sm">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-black-bean text-[#E7C0BC] p-8 rounded-[35px] shadow-2xl min-w-45 transform rotate-2">
                <p className="text-[9px] uppercase font-black tracking-[0.2em] opacity-60 mb-1 text-white">
                  Precio Total
                </p>
                <p className="text-4xl font-serif">${totalPrice}</p>
              </div>
            </div>

            {/* Fila de Miniaturas (Galería) */}
            {product.images && product.images.length > 0 && (
              <div className="flex gap-4 mt-12 flex-wrap">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img.url)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                      mainImage === img.url
                        ? "border-[#D97E8A] scale-110 shadow-lg"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.url}
                      className="w-full h-full object-cover"
                      alt="Vista miniatura"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* LADO DERECHO: INFO Y OPCIONES */}
          <div className="flex flex-col pt-4">
            <header className="hidden lg:block mb-12">
              <span className="text-[#D97E8A] font-black text-[10px] uppercase tracking-[0.3em]">
                Personalizando tu lienzo
              </span>
              <h1 className="text-6xl font-serif text-[#1F412E] mt-4 mb-6 leading-tight">
                {product.name}
              </h1>
              <p className="text-[#1F412E] opacity-80 text-lg leading-relaxed font-medium italic">
                "{product.shortDescription || "Un diseño único creado por ti."}"
              </p>
            </header>

            <div className="space-y-2">
              {renderSection("Size", "1. Elige el Tamaño")}
              {renderSection("Flavor", "2. Sabor del Bizcocho")}
              {renderSection("Filling", "3. Relleno")}
              {renderSection("Decoration", "4. Toques de Diseño (Múltiples)")}
            </div>

            {/* Resumen Final */}
            <div className="mt-12 p-8 rounded-[30px] bg-[#FAF7F2] border border-[#1F412E]/5 shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1F412E] opacity-40 mb-6">
                Resumen de tu selección
              </h4>
              <ul className="space-y-3">
                {Object.entries(selections).map(([key, val]) => {
                  if (!val || (Array.isArray(val) && val.length === 0))
                    return null;
                  return (
                    <li
                      key={key}
                      className="text-[11px] font-black text-[#1F412E] uppercase flex justify-between border-b border-[#1F412E]/5 pb-2"
                    >
                      <span className="opacity-40">
                        {labelsMap[key] || key}:
                      </span>
                      <span className="text-right ml-4">
                        {Array.isArray(val)
                          ? val.map((v) => v.name).join(", ")
                          : val.name}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-10">
              <button
                disabled={
                  !selections.Size ||
                  !selections.Flavor ||
                  !selections.Filling ||
                  isAdded
                }
                onClick={handleAddToCart}
                className={`w-full py-6 rounded-3xl text-[13px] font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl flex items-center justify-center gap-4 group active:scale-95 ${
                  isAdded
                    ? "bg-[#D1EAD8] text-[#1F412E]"
                    : "bg-[#1F412E] text-[#E7C0BC] hover:bg-[#D97E8A] hover:text-white disabled:bg-gray-100"
                }`}
              >
                {isAdded ? (
                  "¡Agregado a tu orden!"
                ) : (
                  <>
                    <ShoppingBag size={18} /> Agregar al carrito — ${totalPrice}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCakeDetail;
