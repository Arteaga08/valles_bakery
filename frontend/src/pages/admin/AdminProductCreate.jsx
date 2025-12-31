import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  X,
  Save,
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  ChevronDown,
} from "lucide-react";

const AdminProductCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [product, setProduct] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    longDescription: "",
    price: 0,
    category: "",
    images: [],
    sizes: [],
    isBestSeller: false,
    preparationTimeMin: 24,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5002/api/categories"
        );
        setCategories(data);
      } catch (error) {
        console.error("Error al cargar categorías");
      }
    };
    fetchCategories();
  }, []);

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    setProduct({ ...product, name, slug });
  };

  const addSize = () => {
    setProduct({
      ...product,
      sizes: [...product.sizes, { name: "", priceAdjustment: 0 }],
    });
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...product.sizes];
    newSizes[index][field] = value;
    setProduct({ ...product, sizes: newSizes });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "vallee_preset");
    formData.append("cloud_name", "dnppruwh4");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dnppruwh4/image/upload",
        formData
      );
      setProduct({
        ...product,
        images: [
          ...product.images,
          { url: res.data.secure_url, isMain: product.images.length === 0 },
        ],
      });
    } catch (err) {
      alert("Error al subir imagen.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (product.images.length === 0)
      return alert("Debes subir al menos una imagen.");

    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const finalProduct = {
        ...product,
        sizes: [{ name: "Estándar", priceAdjustment: 0 }, ...product.sizes],
      };
      await axios.post(
        "http://localhost:5002/api/products",
        finalProduct,
        config
      );
      navigate("/admin/productos");
    } catch (err) {
      alert("Error al crear producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto pb-20 px-4">
      <button
        onClick={() => navigate("/admin/productos")}
        className="flex items-center gap-2 text-gray-400 hover:text-[#1F412E] text-[10px] font-black uppercase tracking-widest mb-10 transition-colors"
      >
        <ArrowLeft size={14} /> Volver al Inventario
      </button>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-12"
      >
        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-2 space-y-12">
          <h2 className="font-serif text-4xl text-[#1F412E]">Nuevo Producto</h2>

          {/* Bloque Nombre y Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 h-4">
                Nombre
              </label>
              <input
                type="text"
                required
                className="w-full border-b border-gray-200 py-3 outline-none focus:border-[#e64a85] transition-all bg-transparent text-sm"
                value={product.name}
                onChange={handleNameChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 h-4">
                Slug (URL)
              </label>
              <input
                type="text"
                readOnly
                className="w-full border-b border-gray-100 py-3 bg-transparent text-gray-300 outline-none italic text-sm cursor-not-allowed"
                value={product.slug}
              />
            </div>
          </div>

          {/* Bloque Técnico: EL QUE ESTABA DISPAREJO */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-end">
            <div className="flex flex-col">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 h-10 flex items-end pb-1">
                Precio Base ($)
              </label>
              <input
                type="number"
                required
                className="w-full border-b border-gray-200 py-3 outline-none focus:border-[#e64a85] bg-transparent text-sm"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 h-10 flex items-end pb-1">
                Categoría
              </label>
              <div className="relative">
                <select
                  required
                  className="w-full border-b border-gray-200 py-3 outline-none bg-transparent text-sm appearance-none cursor-pointer focus:border-[#e64a85]"
                  value={product.category}
                  onChange={(e) =>
                    setProduct({ ...product, category: e.target.value })
                  }
                >
                  <option value="">Seleccionar...</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-0 bottom-3 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 h-10 flex items-end pb-1 leading-tight">
                Tiempo de Anticipación
              </label>
              <div className="relative">
                <select
                  className="w-full border-b border-gray-200 py-3 outline-none bg-transparent text-sm appearance-none cursor-pointer focus:border-[#e64a85]"
                  value={product.preparationTimeMin / 1440}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      preparationTimeMin: e.target.value * 1440,
                    })
                  }
                >
                  <option value="0">Entrega Inmediata</option>
                  <option value="1">1 Día</option>
                  <option value="2">2 Días</option>
                  <option value="3">3 Días</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-0 bottom-3 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Checkboxes agrupados de forma limpia */}
          <div className="bg-[#FAF7F2]/50 p-8 space-y-5 rounded-sm">
            <label className="flex items-center gap-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={product.isBestSeller}
                onChange={(e) =>
                  setProduct({ ...product, isBestSeller: e.target.checked })
                }
                className="w-4 h-4 accent-[#e64a85] rounded-none"
              />
              <span className="text-[10px] font-black uppercase text-[#1F412E] tracking-widest">
                Destacar como Best Seller
              </span>
            </label>
            <label className="flex items-center gap-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={product.preparationTimeMin === 0}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    preparationTimeMin: e.target.checked ? 0 : 1440,
                  })
                }
                className="w-4 h-4 accent-[#1F412E] rounded-none"
              />
              <span className="text-[10px] font-black uppercase text-[#1F412E] tracking-widest">
                Disponible para entrega hoy mismo
              </span>
            </label>
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Descripción Corta
            </label>
            <textarea
              required
              className="w-full border border-gray-100 p-5 h-28 outline-none focus:border-[#e64a85] text-sm resize-none transition-all bg-white"
              value={product.shortDescription}
              onChange={(e) =>
                setProduct({ ...product, shortDescription: e.target.value })
              }
            />
          </div>

          {/* Tamaños Disponibles */}
          <div className="space-y-8 pt-6">
            <div className="flex justify-between items-end border-b border-gray-100 pb-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1F412E]">
                Tamaños Disponibles
              </h4>
              <button
                type="button"
                onClick={addSize}
                className="text-[#e64a85] flex items-center gap-2 text-[10px] font-black uppercase hover:opacity-60 transition-all"
              >
                <Plus size={14} /> Añadir Tamaño
              </button>
            </div>

            <div className="space-y-4">
              {/* Tamaño Estándar Nivelado */}
              <div className="flex gap-8 items-end pb-2">
                <div className="flex-1">
                  <input
                    readOnly
                    value="Estándar"
                    className="w-full border-b border-gray-100 py-3 text-sm text-gray-400 outline-none bg-transparent"
                  />
                </div>
                <div className="w-32">
                  <input
                    readOnly
                    value={product.price || 0}
                    className="w-full border-b border-gray-100 py-3 text-sm text-gray-400 outline-none bg-transparent text-right"
                  />
                </div>
                <div className="w-5"></div>
              </div>

              {/* Dinámicos Nivelados */}
              {product.sizes.map((size, index) => (
                <div
                  key={index}
                  className="flex gap-8 items-end animate-fadeIn pb-2"
                >
                  <div className="flex-1">
                    <input
                      placeholder="Nombre del tamaño"
                      className="w-full border-b border-gray-200 py-3 text-sm outline-none focus:border-[#e64a85] bg-transparent"
                      value={size.name}
                      onChange={(e) =>
                        handleSizeChange(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="w-32 flex items-center gap-2 border-b border-gray-200">
                    <span className="text-[10px] text-gray-300">+$</span>
                    <input
                      type="number"
                      className="w-full py-3 text-sm outline-none bg-transparent text-right"
                      value={size.priceAdjustment}
                      onChange={(e) =>
                        handleSizeChange(
                          index,
                          "priceAdjustment",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setProduct({
                        ...product,
                        sizes: product.sizes.filter((_, i) => i !== index),
                      })
                    }
                    className="text-gray-300 hover:text-red-500 mb-3 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="space-y-10">
          <div className="bg-white p-8 border border-gray-100 shadow-sm">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">
              Galería
            </label>
            <div className="grid grid-cols-2 gap-4">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square group overflow-hidden bg-gray-50 border border-gray-100"
                >
                  <img
                    src={img.url}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                      img.isMain ? "opacity-100" : "opacity-80"
                    }`}
                    alt="cake"
                  />
                  {img.isMain && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#e64a85]"></div>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setProduct({
                        ...product,
                        images: product.images.filter((_, idx) => idx !== i),
                      })
                    }
                    className="absolute top-2 right-2 bg-white text-red-500 rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all group">
                <Upload
                  size={20}
                  className="text-gray-300 group-hover:text-[#e64a85] transition-colors"
                />
                <span className="text-[7px] font-black text-gray-400 mt-3 tracking-[0.2em]">
                  AÑADIR
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1F412E] hover:bg-[#e64a85] text-white py-6 font-black text-[11px] uppercase tracking-[0.4em] transition-all flex justify-center items-center gap-3 shadow-xl"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            Publicar Pastel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductCreate;
