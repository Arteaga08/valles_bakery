import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, Loader2, ImageIcon } from "lucide-react";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("http://localhost:5002/api/categories");
      setCategories(data);
    } catch (error) {
      console.error("Error al cargar categorías", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:5002/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (error) {
      alert("No se pudo eliminar");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-[#e64a85]" size={32} />
      </div>
    );

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="font-serif text-4xl text-[#1F412E]">Categorías</h1>
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold mt-2">
            Organiza tu catálogo
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/categorias/nuevo")}
          className="flex items-center gap-2 bg-[#1F412E] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#e64a85] transition-all"
        >
          <Plus size={16} /> Nueva Categoría
        </button>
      </div>

      <div className="bg-white border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-[#fafafa]">
              <th className="p-5 text-[10px] uppercase tracking-widest text-gray-400 font-black w-24">
                Imagen
              </th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                Nombre
              </th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-gray-400 font-black text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat._id}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td className="p-5">
                  <div className="w-12 h-12 rounded-full bg-[#FAF7F2] overflow-hidden border border-gray-100">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon
                        className="m-auto text-gray-200 mt-3"
                        size={20}
                      />
                    )}
                  </div>
                </td>
                <td className="p-5">
                  <p className="font-bold text-[#1F412E] text-sm uppercase">
                    {cat.name}
                  </p>
                  <p className="text-[10px] text-gray-300 font-mono">
                    /{cat.slug}
                  </p>
                </td>
                <td className="p-5">
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() =>
                        navigate(`/admin/categorias/editar/${cat._id}`)
                      }
                      className="text-gray-400 hover:text-[#1F412E]"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="text-gray-300 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategories;
