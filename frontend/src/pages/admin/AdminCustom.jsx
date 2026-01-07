import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Sparkles,
  Settings2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminCustomProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCustomProducts = async () => {
    try {
      setLoading(true);

      // 1. Obtener el token del localStorage
      const token = localStorage.getItem("adminToken");

      // 2. Configurar los headers
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // 3. Enviar la petición con el config
      const { data } = await axios.get(
        "http://localhost:5002/api/custom-options/products",
        config // 👈 ESTO ES LO QUE FALTA
      );

      console.log("Datos recibidos del backend:", data);
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos custom", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomProducts();
  }, []);

  const handleDelete = async (id) => {
    if (
      window.confirm("¿Deseas eliminar este modelo de pastel personalizado?")
    ) {
      try {
        const token = localStorage.getItem("adminToken");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // ✅ CORRECCIÓN: Borramos en la ruta de custom-options/products
        await axios.delete(
          `http://localhost:5002/api/custom-options/products/${id}`,
          config
        );

        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        alert("Error al borrar el modelo custom");
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-[#D97E8A]" size={32} />
      </div>
    );

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="font-serif text-4xl text-[#1F412E]">Modelos Custom</h1>
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold mt-2">
            Configuración de Formas y Personalización
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/admin/custom-builder")}
            className="flex items-center gap-2 border border-gray-200 text-gray-500 px-6 py-3 hover:bg-gray-50 transition-all rounded-sm"
          >
            <Settings2 size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Gestionar Extras
            </span>
          </button>

          <button
            onClick={() => navigate("/admin/custom/nuevo")}
            className="flex items-center gap-2 bg-[#1F412E] hover:bg-[#D97E8A] text-white px-6 py-3 transition-all shadow-sm group rounded-sm"
          >
            <Plus
              size={16}
              className="group-hover:rotate-90 transition-transform"
            />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Nueva Forma
            </span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-sm overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse min-w-175">
          <thead>
            <tr className="border-b border-gray-100 bg-[#fafafa]">
              <th className="p-5 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                Forma Base
              </th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                Personalización
              </th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                Precio Base
              </th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-gray-400 font-black text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="p-10 text-center text-gray-400 italic text-sm"
                >
                  No hay modelos custom creados aún.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      {/* ✅ CORRECCIÓN: Usamos product.image directamente */}
                      <img
                        src={product.image || "https://via.placeholder.com/150"}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-full bg-gray-50 border border-[#FAF7F2]"
                      />
                      <div>
                        <p className="font-bold text-[#1F412E] text-sm">
                          {product.name}
                        </p>
                        <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">
                          {product.shapeType || "Sin forma"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#FAF7F2] px-3 py-1 rounded-full text-[10px] font-bold text-[#D97E8A] flex items-center gap-1 border border-[#D97E8A]/10">
                        <Sparkles size={10} />
                        {product.allowedOptions?.length || 0} Opciones
                      </span>
                    </div>
                  </td>
                  {/* ✅ CORRECCIÓN: Usamos product.price */}
                  <td className="p-5 font-bold text-[#1F412E] text-sm">
                    ${product.price}
                  </td>
                  <td className="p-5">
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() =>
                          navigate("/admin/custom/editar/" + product._id)
                        }
                        className="text-gray-400 hover:text-[#1F412E] transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCustomProducts;
