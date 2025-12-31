import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit2, Trash2, Loader2, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5002/api/products");
      console.log("Primer producto recibido:", data[0]); // 👈 AÑADE ESTO
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-[#e64a85]" size={32} />
      </div>
    );

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        // 1. Recuperar el token guardado al hacer login
        const token = localStorage.getItem("adminToken");

        // 2. Configurar los headers para que el middleware 'protect' lo reconozca
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // 3. Ejecutar la petición al puerto 5002
        await axios.delete(`http://localhost:5002/api/products/${id}`, config);

        // 4. Actualizar la interfaz (quitar el producto de la lista)
        setProducts(products.filter((p) => p._id !== id));

        alert("Producto eliminado exitosamente");
      } catch (err) {
        console.error("Error al borrar:", err.response?.data || err.message);
        alert(
          err.response?.data?.message ||
            "No tienes permisos para borrar este producto"
        );
      }
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="font-serif text-4xl text-[#1F412E]">Productos</h1>
          <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold mt-2">
            Gestión de Inventario
          </p>
        </div>
        <button
          onClick={() => navigate("nuevo")}
          className="flex items-center gap-2 bg-[#1F412E] hover:bg-[#e64a85] text-white px-6 py-3 transition-all duration-300 shadow-sm group"
        >
          <Plus
            size={16}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Añadir Pastel
          </span>
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-sm overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse min-w-175">
          <thead>
            <tr className="border-b border-gray-100 bg-[#fafafa]">
              <th className="p-5 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                Info
              </th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                Categoría
              </th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                Precio
              </th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-gray-400 font-black">
                Status
              </th>
              <th className="p-5 text-[10px] uppercase tracking-widest text-gray-400 font-black text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td className="p-5">
                  <div className="flex items-center gap-4">
                    <img
                      // Accedemos al primer elemento del arreglo 'images'
                      src={
                        product.images && product.images.length > 0
                          ? product.images[0].url
                          : "https://via.placeholder.com/150"
                      }
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md bg-gray-100"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                    <div>
                      <p className="font-bold text-[#1F412E] text-sm">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-tighter">
                        ID: {product._id.slice(-6)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-5 text-xs text-gray-500 font-medium">
                  <span className="bg-[#FAF7F2] px-2 py-1 rounded text-[#1F412E]">
                    {product.category?.name || "Sin categoría"}
                  </span>
                </td>
                <td className="p-5 font-bold text-[#1F412E] text-sm">
                  ${product.price}
                </td>
                <td className="p-5">
                  {product.isBestSeller && (
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-[#e64a85]">
                      <Star size={10} fill="#e64a85" /> Best Seller
                    </span>
                  )}
                </td>
                <td className="p-5">
                  <div className="flex justify-end gap-4">
                    {/* 3. Agregar el onClick con la ruta de edición */}
                    <button
                      onClick={() => navigate(`editar/${product._id}`)}
                      className="text-gray-400 hover:text-[#1F412E] transition-colors"
                      title="Editar producto"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      title="Eliminar producto"
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

export default AdminProducts;
