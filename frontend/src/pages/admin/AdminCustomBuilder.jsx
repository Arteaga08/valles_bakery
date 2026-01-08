import React, { useState, useEffect } from "react";
import {
  Save,
  Layers,
  Maximize,
  Droplet,
  Sparkles,
  Plus,
  Loader2,
  Trash2,
  DollarSign,
  Image as ImageIcon,
  Utensils,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../service/api";
import axios from "axios";

const AdminCustomBuilder = () => {
  const navigate = useNavigate();
  const TABS = [
    { id: "Shape", label: "Formas", icon: Layers },
    { id: "Size", label: "Tamaños", icon: Maximize },
    { id: "Flavor", label: "Bizcocho", icon: Utensils },
    { id: "Filling", label: "Rellenos", icon: Droplet },
    { id: "Decoration", label: "Extras", icon: Sparkles },
  ];

  const [activeTab, setActiveTab] = useState("Shape");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    basePrice: "",
    image: "",
  });

  useEffect(() => {
    fetchOptions();
  }, [activeTab]);

  const fetchOptions = async () => {
    setLoading(true);
    try {
      // Asegúrate de que API tenga la baseURL correcta
      const { data } = await API.get(`/custom-options?type=${activeTab}`);
      setItems(data);
    } catch (error) {
      console.error("Error al traer opciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newItem.name) return alert("El nombre es obligatorio");

    try {
      // 1. Obtener el token
      const token = localStorage.getItem("adminToken");

      // 2. Configurar el header de autorización
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // 3. Enviar la petición con el config
      await axios.post(
        "http://localhost:5002/api/custom-options",
        {
          ...newItem,
          type: activeTab,
          basePrice: Number(newItem.basePrice) || 0,
        },
        config // <--- IMPORTANTE PASAR EL CONFIG
      );

      setNewItem({ name: "", basePrice: "", image: "" });
      fetchOptions();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error al crear opción");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta opción?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(
        `http://localhost:5002/api/custom-options/${id}`,
        config
      );
      setItems(items.filter((item) => item._id !== id));
    } catch (error) {
      alert("No se pudo eliminar la opción");
    }
  };

  return (
    <div className="animate-fadeIn p-4">
      <button
        onClick={() => navigate("/admin/custom")}
        className="flex items-center gap-2 text-gray-400 hover:text-[#1F412E] text-[10px] font-black uppercase tracking-widest mb-10"
      >
        <ArrowLeft size={14} /> Volver a Modelos Custom
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* TABS LATERALES */}
        <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 p-4 rounded-xl text-left transition-all ${
                activeTab === tab.id
                  ? "bg-white shadow-md text-[#D97E8A] border-l-4 border-[#D97E8A]"
                  : "text-gray-400 hover:bg-white/50"
              }`}
            >
              <tab.icon size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* LISTADO Y FORMULARIO */}
        <div className="flex-1 bg-white p-8 border border-gray-100 shadow-sm">
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 bg-[#FAF7F2] p-6 rounded-xl"
          >
            <input
              type="text"
              placeholder="Nombre"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="border-b border-gray-200 bg-transparent p-2 text-sm outline-none focus:border-[#D97E8A]"
            />
            <input
              type="number"
              placeholder="Precio Extra"
              value={newItem.basePrice}
              onChange={(e) =>
                setNewItem({ ...newItem, basePrice: e.target.value })
              }
              className="border-b border-gray-200 bg-transparent p-2 text-sm outline-none focus:border-[#D97E8A]"
            />
            <input
              type="text"
              placeholder="URL Imagen (Opcional)"
              value={newItem.image}
              onChange={(e) =>
                setNewItem({ ...newItem, image: e.target.value })
              }
              className="border-b border-gray-200 bg-transparent p-2 text-sm outline-none focus:border-[#D97E8A]"
            />
            <button
              type="submit"
              className="bg-[#1F412E] text-white rounded-lg flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#D97E8A] transition-all"
            >
              <Plus size={14} /> Agregar
            </button>
          </form>

          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-[#D97E8A]" />
              </div>
            ) : (
              items
                .filter((item) => item.type === activeTab) // ✅ Filtro de seguridad en el cliente
                .map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center p-4 border border-gray-50 hover:border-[#D97E8A]/20 transition-all rounded-xl"
                  >
                    <span className="text-sm font-bold text-[#1F412E]">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-[#D97E8A]">
                        +${item.basePrice}
                      </span>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-gray-300 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomBuilder;
