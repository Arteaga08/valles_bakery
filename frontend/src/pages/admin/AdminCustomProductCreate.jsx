import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Upload,
  X,
  Save,
  ArrowLeft,
  Loader2,
  Sparkles,
  Utensils,
  Droplet,
  Maximize,
  Layers,
} from "lucide-react";
import API from "../../service/api";

const AdminCustomProductCreate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);

  const [dbOptions, setDbOptions] = useState({
    Size: [],
    Flavor: [],
    Filling: [],
    Decoration: [],
  });

  const [dbShapes, setDbShapes] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    slug: "",
    price: 0,
    images: [],
    category: "",
    isCustom: true,
    allowedOptions: [],
    shortDescription: "",
    shapeType: "",
  });

  // 1. CARGAR FORMAS Y DATOS INICIALES
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Ejecutamos peticiones en paralelo para mayor velocidad
        const [shapesRes, optionsRes, catRes] = await Promise.all([
          API.get("/custom-options?type=Shape"),
          API.get("/custom-options"),
          API.get("/categories"),
        ]);

        setDbShapes(shapesRes.data);

        setDbOptions({
          Size: optionsRes.data.filter((o) => o.type === "Size"),
          Flavor: optionsRes.data.filter((o) => o.type === "Flavor"),
          Filling: optionsRes.data.filter((o) => o.type === "Filling"),
          Decoration: optionsRes.data.filter((o) => o.type === "Decoration"),
        });

        if (id) {
          const { data: productData } = await API.get(
            `/custom-options/products/${id}`
          );
          setProduct({
            ...productData,
            allowedOptions:
              productData.allowedOptions?.map((opt) =>
                typeof opt === "object" ? opt._id : opt
              ) || [],
            category: productData.category?._id || productData.category,
          });
        } else {
          // BUSQUEDA INTELIGENTE DE CATEGORÍA
          const miPastelCat = catRes.data.find(
            (c) =>
              c.slug === "mi-pastel" ||
              c.name.toLowerCase().includes("mi pastel")
          );
          if (miPastelCat) {
            setProduct((prev) => ({ ...prev, category: miPastelCat._id }));
          }
        }
      } catch (err) {
        console.error("Error cargando datos iniciales:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchInitialData();
  }, [id]);

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");
    setProduct({ ...product, name, slug });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "vallee_preset");

    try {
      // Cloudinary es externo, aquí sí usamos axios directo
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dnppruwh4/image/upload",
        formData
      );
      setProduct({
        ...product,
        images: [{ url: res.data.secure_url, isMain: true }],
      });
    } catch (err) {
      alert("Error al subir imagen a la nube.");
    } finally {
      setLoading(false);
    }
  };

  const toggleOption = (optionId) => {
    setProduct((prev) => {
      const current = prev.allowedOptions;
      return {
        ...prev,
        allowedOptions: current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (product.images.length === 0) return alert("Sube la imagen base.");
    if (!product.shapeType) return alert("Selecciona una forma base.");
    if (!product.category)
      return alert("Error: No se encontró la categoría 'Mi Pastel'.");

    setLoading(true);
    try {
      const finalProduct = {
        ...product,
        price: Number(product.price),
        image: product.images[0].url,
        brand: "Vallée Bakery",
        countInStock: 99,
        description: product.shortDescription,
      };

      // ✅ API ya tiene el token inyectado, no necesitamos config
      if (id) {
        await API.put(`/custom-options/products/${id}`, finalProduct);
      } else {
        await API.post("/custom-options/products", finalProduct);
      }

      navigate("/admin/custom");
    } catch (err) {
      console.error("Error al guardar:", err.response?.data);
      alert(err.response?.data?.message || "No se pudo guardar el modelo");
    } finally {
      setLoading(false);
    }
  };

  const renderOptionGroup = (type, label, Icon) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
        <Icon size={14} className="text-[#D97E8A]" />
        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1F412E]">
          {label}
        </h4>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {dbOptions[type].map((opt) => (
          <div
            key={opt._id}
            onClick={() => toggleOption(opt._id)}
            className={`p-4 border transition-all cursor-pointer flex justify-between items-center rounded-lg ${
              product.allowedOptions.includes(opt._id)
                ? "border-[#D97E8A] bg-[#FAF7F2]"
                : "border-gray-100 opacity-60 hover:opacity-100"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              {opt.name}
            </span>
            <span className="text-[9px] text-[#D97E8A]">
              {opt.basePrice > 0 ? `+$${opt.basePrice}` : "Base"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  if (fetching)
    return (
      <div className="h-screen flex items-center justify-center font-serif text-[#1F412E]">
        Cargando configuración...
      </div>
    );

  return (
    <div className="animate-fadeIn max-w-7xl mx-auto pb-20 px-4 pt-10">
      <button
        onClick={() => navigate("/admin/custom")}
        className="flex items-center gap-2 text-gray-400 hover:text-[#1F412E] text-[10px] font-black uppercase tracking-widest mb-10"
      >
        <ArrowLeft size={14} /> Volver a Modelos Custom
      </button>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-12"
      >
        <div className="lg:col-span-2 space-y-12">
          <h2 className="font-serif text-4xl text-[#1F412E]">
            {id ? "Editar" : "Nuevo"} Producto Custom
          </h2>

          <div className="space-y-10">
            {/* SELECTOR DE FORMA */}
            <div className="flex flex-col gap-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                1. Selecciona la Forma Geométrica Base
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dbShapes.map((shape) => (
                  <button
                    key={shape._id}
                    type="button"
                    onClick={() =>
                      setProduct({ ...product, shapeType: shape.name })
                    }
                    className={`flex flex-col items-center gap-3 p-4 border transition-all duration-300 rounded-xl ${
                      product.shapeType === shape.name
                        ? "border-[#D97E8A] bg-[#FAF7F2] text-[#1F412E] shadow-sm"
                        : "border-gray-100 text-gray-300 hover:border-gray-200"
                    }`}
                  >
                    {shape.image ? (
                      <img
                        src={shape.image}
                        alt={shape.name}
                        className="w-10 h-10 object-contain"
                      />
                    ) : (
                      <Layers size={20} />
                    )}
                    <span className="text-[9px] font-black uppercase tracking-tighter">
                      {shape.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* DATOS BÁSICOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Nombre del Modelo
                </label>
                <input
                  type="text"
                  required
                  className="w-full border-b border-gray-200 py-3 outline-none focus:border-[#D97E8A] bg-transparent text-sm"
                  value={product.name}
                  onChange={handleNameChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Precio Base ($)
                </label>
                <input
                  type="number"
                  required
                  className="w-full border-b border-gray-200 py-3 outline-none focus:border-[#D97E8A] bg-transparent text-sm"
                  value={product.price}
                  onChange={(e) =>
                    setProduct({ ...product, price: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Descripción Corta
              </label>
              <input
                type="text"
                required
                placeholder="Ej. El lienzo ideal para tus mensajes más dulces."
                className="w-full border-b border-gray-200 py-3 outline-none focus:border-[#D97E8A] bg-transparent text-sm italic"
                value={product.shortDescription}
                onChange={(e) =>
                  setProduct({ ...product, shortDescription: e.target.value })
                }
              />
            </div>
          </div>

          <div className="bg-[#FAF7F2] p-8 rounded-2xl border border-gray-50">
            <p className="text-[10px] font-black uppercase text-[#D97E8A] tracking-widest mb-8">
              Opciones Disponibles
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {renderOptionGroup("Size", "Tamaños", Maximize)}
              {renderOptionGroup("Flavor", "Bizcochos", Utensils)}
              {renderOptionGroup("Filling", "Rellenos", Droplet)}
              {renderOptionGroup("Decoration", "Decoraciones", Sparkles)}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 border border-gray-100 shadow-sm rounded-2xl">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">
              Imagen del Modelo
            </label>
            <div className="relative aspect-square group overflow-hidden bg-gray-50 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center">
              {product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[0].url}
                    className="w-full h-full object-cover"
                    alt="cake"
                  />
                  <button
                    type="button"
                    onClick={() => setProduct({ ...product, images: [] })}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-red-500 rounded-full p-2 shadow-sm"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100/50 transition-all group">
                  <Upload
                    size={24}
                    className="text-gray-300 group-hover:text-[#D97E8A]"
                  />
                  <span className="text-[8px] font-black text-gray-400 mt-4 tracking-widest">
                    SUBIR FOTO
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1F412E] hover:bg-[#D97E8A] text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all flex justify-center items-center gap-3 shadow-xl disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            {id ? "Actualizar Modelo" : "Publicar Modelo"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCustomProductCreate;
