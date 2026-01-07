import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, Loader2, ArrowLeft } from "lucide-react";
import API from "../service/api";

const CustomCakeDetail = () => {
  const { id } = useParams(); // Recibe el ID del producto (la forma)
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState({
    Size: null,
    Flavor: null,
    Filling: null,
    Decoration: null,
  });
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // 1. Cargamos el producto base (ej: Corazón Vintage)
        // Este ya trae "allowedOptions" pobladas desde el backend
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);

        // 2. Establecemos el precio base inicial
        setTotalPrice(data.price);
        setLoading(false);
      } catch (err) {
        console.error("Error cargando producto custom", err);
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  // Calcular precio total dinámicamente
  useEffect(() => {
    if (!product) return;

    const base = product.price || 0;
    const extraPrice = Object.values(selections).reduce((acc, curr) => {
      return acc + (curr?.basePrice || 0);
    }, base);

    setTotalPrice(extraPrice);
  }, [selections, product]);

  const handleSelect = (type, item) => {
    setSelections((prev) => ({ ...prev, [type]: item }));
  };

  const renderSection = (type, label) => {
    // IMPORTANTE: Solo mostramos las opciones que el ADMIN permitió para este pastel
    const filtered =
      product.allowedOptions?.filter((o) => o.type === type) || [];
    if (filtered.length === 0) return null;

    return (
      <div className="mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
          {label}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map((item) => (
            <button
              key={item._id}
              onClick={() => handleSelect(type, item)}
              className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 text-[11px] font-bold uppercase tracking-tight text-left flex flex-col ${
                selections[type]?._id === item._id
                  ? "border-[#D97E8A] bg-[#FAF7F2] text-[#1F412E]"
                  : "border-gray-100 text-gray-400 hover:border-gray-200"
              }`}
            >
              <span>{item.name}</span>
              {item.basePrice > 0 && (
                <span className="text-[9px] text-[#D97E8A] mt-1">
                  +${item.basePrice}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#D97E8A]" size={40} />
      </div>
    );

  if (!product) return <div>Producto no encontrado</div>;

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* LADO IZQUIERDO: IMAGEN DE LA FORMA */}
        <div className="lg:sticky lg:top-32 h-fit">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black"
          >
            <ArrowLeft size={14} /> Volver
          </button>

          <div className="aspect-square bg-[#FAF7F2] rounded-[40px] overflow-hidden border border-gray-100 relative shadow-inner">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-700"
            />

            <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md px-8 py-4 rounded-3xl shadow-xl border border-white">
              <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">
                Precio Final
              </p>
              <p className="text-3xl font-serif text-[#1F412E]">
                ${totalPrice} <span className="text-sm">MXN</span>
              </p>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: CONFIGURADOR BASADO EN ALLOWED OPTIONS */}
        <div className="flex flex-col">
          <div className="mb-10">
            <span className="text-[#D97E8A] font-bold text-xs uppercase tracking-widest">
              Personalizando: {product.name}
            </span>
            <h1 className="text-5xl font-serif text-[#1F412E] mt-2">
              Configura tu Pastel
            </h1>
            <p className="text-gray-500 mt-4 leading-relaxed">
              Has seleccionado la base <strong>{product.name}</strong>. Ahora
              elige los sabores y detalles que más te gusten.
            </p>
          </div>

          <div className="space-y-4">
            {renderSection("Size", "1. Porciones")}
            {renderSection("Flavor", "2. Bizcocho")}
            {renderSection("Filling", "3. Relleno")}
            {renderSection("Decoration", "4. Decoración Final")}
          </div>

          <div className="mt-12 p-8 bg-[#FAF7F2] rounded-[30px] border border-gray-100">
            <button className="w-full bg-[#1F412E] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.4em] hover:bg-[#D97E8A] transition-all shadow-xl flex items-center justify-center gap-3">
              Añadir {product.name} al Carrito <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCakeDetail;
