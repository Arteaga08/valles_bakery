import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-[#e64a85]" size={32} />
      </div>
    );

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="font-serif text-4xl text-[#1F412E]">Categorías</h1>
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold mt-2">
            Organiza tu menú
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#1F412E] text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#e64a85] transition-all shadow-lg shadow-gray-200">
          <Plus size={16} /> Nueva Categoría
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-[#fafafa]">
              <th className="p-5 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                Nombre
              </th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                Slug / Identificador
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
                <td className="p-5 font-bold text-[#1F412E] text-sm">
                  {cat.name}
                </td>
                <td className="p-5 text-xs text-gray-400 font-mono">
                  {cat.slug || cat._id}
                </td>
                <td className="p-5">
                  <div className="flex justify-end gap-4">
                    <button
                      title="Editar"
                      className="text-gray-400 hover:text-[#1F412E] transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      title="Eliminar"
                      className="text-gray-300 hover:text-red-500 transition-colors"
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
