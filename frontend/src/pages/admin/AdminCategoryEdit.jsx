import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, ImageIcon, Loader2 } from "lucide-react";

const AdminCategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({ name: "", slug: "", image: "" });

  useEffect(() => {
    const fetchCat = async () => {
      // 1. VALIDACIÓN ESTRICTA:
      // Si el ID no existe o no tiene el largo de un ID de MongoDB (24 chars),
      // NO hacemos la petición. Esto evita el error 404 del "undefined".
      if (!id || id.length < 24)
      return;

      try {
        setFetching(true);
        const res = await axios.get(
          `http://localhost:5002/api/categories/${id}`
        );

        if (res.data) {
          setFormData({
            name: res.data.name || "",
            slug: res.data.slug || "",
            image: res.data.image || "",
          });
        }
      } catch (err) {
        // Solo aparecerá si el ID de 24 caracteres realmente no existe en la DB
        console.error("Error real:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchCat();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(`http://localhost:5002/api/categories/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/admin/categorias");
    } catch (err) {
      alert("Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return <Loader2 className="animate-spin text-[#e64a85] m-auto mt-20" />;

  return (
    <div className="max-w-2xl animate-fadeIn">
      <button
        onClick={() => navigate("/admin/categorias")}
        className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-6"
      >
        <ArrowLeft size={14} /> Cancelar
      </button>
      <div className="bg-white p-8 border border-gray-100 shadow-sm">
        <h2 className="font-serif text-2xl text-[#1F412E] mb-8">
          Editar Categoría
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-gray-400">
              Nombre
            </label>
            <input
              type="text"
              required
              className="border-b h-10 outline-none focus:border-[#e64a85]"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          {/* El resto del formulario de imagen y slug igual que Create */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1F412E] text-white py-4 text-[10px] font-black uppercase tracking-widest"
          >
            {loading ? (
              <Loader2 className="animate-spin m-auto" size={18} />
            ) : (
              "Guardar Cambios"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCategoryEdit;
