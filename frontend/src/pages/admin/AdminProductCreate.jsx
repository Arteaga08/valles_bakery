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
    sizes: [{ name: "Estándar", priceAdjustment: 0 }], // Requerido por tu schema
    tags: [],
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

  // Generar Slug automático basado en el nombre
  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    setProduct({ ...product, name, slug });
  };

  // Manejo de Tamaños (Sizes)
  const addSize = () => {
    setProduct({
      ...product,
      sizes: [...product.sizes, { name: "", priceAdjustment: 0 }],
    });
  };

  const removeSize = (index) => {
    const newSizes = product.sizes.filter((_, i) => i !== index);
    setProduct({ ...product, sizes: newSizes });
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
    formData.append("upload_preset", "vallee_preset"); // 👈 El nombre del preset Unsigned
    formData.append("cloud_name", "dnppruwh4"); // 👈 Tu Cloud Name

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dnppruwh4/image/upload", // 👈 Tu Cloud Name aquí también
        formData
      );

      // Ajustamos al esquema { url, isMain } que pide tu modelo
      setProduct({
        ...product,
        images: [
          ...product.images,
          { url: res.data.secure_url, isMain: product.images.length === 0 },
        ],
      });
    } catch (err) {
      console.error("Error detallado:", err.response?.data);
      alert("Error al subir imagen a Cloudinary. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  // Dentro de tu componente AdminProductCreate.jsx

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDACIÓN LÓGICA DE IMÁGENES
    if (product.images.length === 0) {
      return alert("Debes subir al menos una imagen.");
    }
    if (product.isBestSeller && product.images.length < 2) {
      if (
        !window.confirm(
          "Los Best Sellers suelen verse mejor con 2 imágenes (efecto hover). ¿Deseas continuar con solo una?"
        )
      ) {
        return;
      }
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // LÓGICA DE TAMAÑOS:
      // Si el Admin no agregó tamaños extras, enviamos el Estándar por defecto.
      // Esto asegura que el campo 'sizes' (que es obligatorio en tu modelo) nunca vaya vacío.
      const finalProduct = {
        ...product,
        sizes:
          product.sizes.length > 0
            ? product.sizes
            : [{ name: "Estándar", priceAdjustment: 0 }],
      };

      await axios.post(
        "http://localhost:5002/api/products",
        finalProduct,
        config
      );
      navigate("/admin/productos");
    } catch (err) {
      alert(err.response?.data?.message || "Error al crear producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto pb-20">
      <button
        onClick={() => navigate("/admin/productos")}
        className="flex items-center gap-2 text-gray-400 hover:text-[#1F412E] text-[10px] font-black uppercase tracking-widest mb-6"
      >
        <ArrowLeft size={14} /> Volver
      </button>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* COLUMNA IZQUIERDA: Info Principal */}
        <div className="lg:col-span-2 space-y-6 bg-white p-8 border border-gray-100">
          <h2 className="font-serif text-2xl text-[#1F412E]">
            Información del Producto
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400">
                Nombre
              </label>
              <input
                type="text"
                required
                className="w-full border-b p-2 outline-none focus:border-[#e64a85]"
                value={product.name}
                onChange={handleNameChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400">
                Slug (URL)
              </label>
              <input
                type="text"
                readOnly
                className="w-full border-b p-2 bg-gray-50 text-gray-400 outline-none"
                value={product.slug}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 items-start">
            {/* Precio Base */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-gray-400 h-4">
                Precio Base ($)
              </label>
              <input
                type="number"
                required
                className="w-full border-b border-gray-200 h-10 py-2 outline-none focus:border-[#e64a85] transition-colors bg-transparent"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
              />
            </div>

            {/* Categoría */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-gray-400 h-4">
                Categoría
              </label>
              <select
                required
                className="w-full border-b border-gray-200 h-10 py-2 outline-none bg-transparent focus:border-[#e64a85] transition-colors appearance-none cursor-pointer"
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
            </div>

            {/* Tiempo de Anticipación */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-gray-400 h-4 leading-tight">
                Anticipación
              </label>
              <select
                className="w-full border-b border-gray-200 h-10 py-2 outline-none bg-transparent focus:border-[#e64a85] transition-colors appearance-none cursor-pointer"
                value={product.preparationTimeMin / 1440}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    preparationTimeMin: e.target.value * 1440,
                  })
                }
              >
                <option value="0">Entrega</option>
                <option value="1">1 Día</option>
                <option value="2">2 Días</option>
                <option value="3">3 Días</option>
                <option value="7">1 Semana</option>
              </select>
            </div>
          </div>

          {/* Sección de Tags / Disponibilidad debajo de los checkboxes */}
          <div className="bg-white p-6 border border-gray-100 space-y-4 mt-6">
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.isBestSeller}
                  onChange={(e) =>
                    setProduct({ ...product, isBestSeller: e.target.checked })
                  }
                  className="accent-[#e64a85]"
                />
                <span className="text-[10px] font-black uppercase text-[#1F412E]">
                  Destacar como BestSeller
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.preparationTimeMin === 0}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      preparationTimeMin: e.target.checked ? 0 : 1440,
                    })
                  }
                  className="accent-[#e64a85]"
                />
                <span className="text-[10px] font-black uppercase text-[#1F412E]">
                  Disponible para entrega hoy mismo
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400">
              Descripción Corta
            </label>
            <textarea
              required
              className="w-full border p-3 h-20 outline-none focus:border-[#e64a85]"
              value={product.shortDescription}
              onChange={(e) =>
                setProduct({ ...product, shortDescription: e.target.value })
              }
            />
          </div>

          {/* SECCIÓN DE TAMAÑOS (SIZES) */}
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-[10px] font-black uppercase text-[#1F412E]">
                  Configuración de Tamaños
                </h4>
                <p className="text-[9px] text-gray-400">
                  El tamaño estándar usa el precio base definido arriba.
                </p>
              </div>
              <button
                type="button"
                onClick={addSize}
                className="text-[#e64a85] flex items-center gap-1 text-[10px] font-bold hover:underline"
              >
                <Plus size={12} /> AÑADIR OTRO TAMAÑO
              </button>
            </div>

            <div className="space-y-3">
              {/* FILA ESTÁNDAR: Automática y Bloqueada */}
              <div className="flex gap-4 items-center bg-gray-50/50 p-2 rounded border border-dashed border-gray-200">
                <div className="flex-1">
                  <input
                    readOnly
                    value="Estándar (Precio Base)"
                    className="w-full bg-transparent py-1 text-sm outline-none text-gray-400 italic"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400">$</span>
                  <input
                    readOnly
                    value={product.price || 0}
                    className="w-20 bg-transparent py-1 text-sm outline-none font-bold text-[#1F412E]"
                  />
                </div>
                <div className="w-8"></div>{" "}
                {/* Espacio para alinear con el icono de basura */}
              </div>

              {/* VARIACIONES ADICIONALES */}
              {product.sizes.map((size, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-center bg-white p-2 rounded border border-gray-100 animate-fadeIn shadow-sm"
                >
                  <input
                    placeholder="Nombre (ej: Grande / 20 personas)"
                    className="flex-1 bg-transparent border-b border-gray-200 py-1 text-sm outline-none focus:border-[#e64a85]"
                    value={size.name}
                    onChange={(e) =>
                      handleSizeChange(index, "name", e.target.value)
                    }
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500">+$</span>
                    <input
                      type="number"
                      placeholder="Extra"
                      className="w-20 bg-transparent border-b border-gray-200 py-1 text-sm outline-none focus:border-[#e64a85]"
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
                    onClick={() => removeSize(index)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Imágenes y Acciones */}
        <div className="space-y-6">
          <div className="bg-white p-6 border border-gray-100">
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-4">
              Galería de Imágenes
            </label>
            <div className="grid grid-cols-2 gap-2">
              {product.images.map((img, i) => (
                <div key={i} className="relative aspect-square group">
                  <img
                    src={img.url}
                    className={`w-full h-full object-cover rounded shadow-sm ${
                      img.isMain ? "ring-2 ring-[#e64a85]" : ""
                    }`}
                    alt="cake"
                  />
                  {img.isMain && (
                    <span className="absolute top-1 left-1 bg-[#e64a85] text-white text-[8px] px-1 font-bold">
                      PRINCIPAL
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setProduct({
                        ...product,
                        images: product.images.filter((_, idx) => idx !== i),
                      })
                    }
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload size={20} className="text-gray-300" />
                <span className="text-[8px] font-bold text-gray-400 mt-2">
                  SUBIR
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-100 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={product.isBestSeller}
                onChange={(e) =>
                  setProduct({ ...product, isBestSeller: e.target.checked })
                }
                className="accent-[#e64a85]"
              />
              <span className="text-[10px] font-black uppercase text-[#1F412E]">
                Destacar como Best Seller
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1F412E] text-white py-5 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#e64a85] transition-all flex justify-center items-center gap-2 shadow-xl shadow-gray-200"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            Publicar Pastel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductCreate;
