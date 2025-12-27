import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Upload,
  X,
  Save,
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState([]);

  const [product, setProduct] = useState({
    name: "",
    slug: "",
    price: 0,
    category: "",
    shortDescription: "",
    longDescription: "",
    images: [],
    sizes: [],
    isBestSeller: false,
    preparationTimeMin: 24,
  });

  // 1. Cargar Datos del Producto
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [catRes, prodRes] = await Promise.all([
          axios.get("http://localhost:5002/api/categories"),
          axios.get(`http://localhost:5002/api/products/${id}`),
        ]);

        setCategories(catRes.data);
        const p = prodRes.data;

        setProduct({
          ...p,
          category: p.category?._id || p.category,
          // Filtramos el tamaño "Estándar" para que no aparezca en la lista de editables
          sizes: p.sizes.filter((s) => s.name !== "Estándar"),
        });
      } catch (error) {
        alert("Error al cargar el producto");
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id]);

  // Lógica de Slug e Imágenes (Igual que en Create)
  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
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
      alert("Error al subir imagen");
    } finally {
      setLoading(false);
    }
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...product.sizes];
    newSizes[index][field] = value;
    setProduct({ ...product, sizes: newSizes });
  };

  // 2. Guardar Cambios (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Inyectamos el tamaño Estándar manualmente antes de enviar
      const finalProduct = {
        ...product,
        sizes: [{ name: "Estándar", priceAdjustment: 0 }, ...product.sizes],
      };

      await axios.put(
        `http://localhost:5002/api/products/${id}`,
        finalProduct,
        config
      );
      navigate("/admin/productos");
    } catch (err) {
      alert("Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#e64a85]" size={40} />
      </div>
    );

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto pb-20">
      <button
        onClick={() => navigate("/admin/productos")}
        className="flex items-center gap-2 text-gray-400 hover:text-[#1F412E] text-[10px] font-black uppercase tracking-widest mb-6"
      >
        <ArrowLeft size={14} /> Cancelar Edición
      </button>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* COLUMNA IZQUIERDA: Formulario Principal */}
        <div className="lg:col-span-2 space-y-8 bg-white p-8 border border-gray-100 shadow-sm">
          <h2 className="font-serif text-2xl text-[#1F412E]">
            Editar: {product.name}
          </h2>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-gray-400">
                Nombre del Pastel
              </label>
              <input
                type="text"
                required
                className="w-full border-b h-10 py-2 outline-none focus:border-[#e64a85]"
                value={product.name}
                onChange={handleNameChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-gray-400">
                Slug (URL)
              </label>
              <input
                type="text"
                readOnly
                className="w-full border-b h-10 py-2 bg-gray-50 text-gray-400"
                value={product.slug}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-gray-400">
                Precio Base ($)
              </label>
              <input
                type="number"
                required
                className="w-full border-b h-10 py-2 outline-none"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-gray-400">
                Categoría
              </label>
              <select
                required
                className="w-full border-b h-10 py-2 outline-none bg-transparent"
                value={product.category}
                onChange={(e) =>
                  setProduct({ ...product, category: e.target.value })
                }
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-gray-400">
                Anticipación
              </label>
              <select
                className="w-full border-b h-10 py-2 outline-none bg-transparent"
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
            </div>
          </div>

          {/* TAMAÑOS (Igual que en Create) */}
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-black uppercase text-[#1F412E]">
                Tamaños y Variaciones
              </h4>
              <button
                type="button"
                onClick={() =>
                  setProduct({
                    ...product,
                    sizes: [...product.sizes, { name: "", priceAdjustment: 0 }],
                  })
                }
                className="text-[#e64a85] text-[10px] font-bold hover:underline"
              >
                + AÑADIR OTRO TAMAÑO
              </button>
            </div>

            {/* Fila Estándar Automática */}
            <div className="flex gap-4 items-center bg-gray-50/50 p-2 rounded border border-dashed border-gray-200 opacity-60">
              <input
                readOnly
                value="Estándar (Precio Base)"
                className="flex-1 bg-transparent text-sm italic outline-none"
              />
              <div className="flex items-center gap-2">
                <span className="text-[10px]">$</span>
                <input
                  readOnly
                  value={product.price}
                  className="w-20 bg-transparent text-sm font-bold outline-none"
                />
              </div>
              <div className="w-8"></div>
            </div>

            {product.sizes.map((size, index) => (
              <div
                key={index}
                className="flex gap-4 items-center bg-white p-2 rounded border border-gray-100 shadow-sm animate-fadeIn"
              >
                <input
                  placeholder="Ej: Grande"
                  className="flex-1 bg-transparent border-b py-1 text-sm outline-none"
                  value={size.name}
                  onChange={(e) =>
                    handleSizeChange(index, "name", e.target.value)
                  }
                />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400">+$</span>
                  <input
                    type="number"
                    className="w-20 bg-transparent border-b py-1 text-sm outline-none"
                    value={size.priceAdjustment}
                    onChange={(e) =>
                      handleSizeChange(index, "priceAdjustment", e.target.value)
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
                  className="text-gray-300 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: Galería y Guardar */}
        <div className="space-y-6">
          <div className="bg-white p-6 border border-gray-100 shadow-sm">
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">
              Galería
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
                Best Seller (Hover effect)
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
            Actualizar Pastel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductEdit;
