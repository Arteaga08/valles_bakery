import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Upload, ImageIcon, Loader2 } from "lucide-react";

const AdminCategoryCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", slug: "", image: "" });

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-");
    setFormData({ ...formData, name, slug });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "vallee_preset");
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dnppruwh4/image/upload",
        data
      );
      setFormData({ ...formData, image: res.data.secure_url });
    } catch (err) {
      alert("Error al subir imagen");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      await axios.post("http://localhost:5002/api/categories", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/admin/categorias");
    } catch (err) {
      alert("Error al crear");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl animate-fadeIn">
      <button
        onClick={() => navigate("/admin/categorias")}
        className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest mb-6"
      >
        <ArrowLeft size={14} /> Volver
      </button>
      <div className="bg-white p-8 border border-gray-100 shadow-sm">
        <h2 className="font-serif text-2xl text-[#1F412E] mb-8">
          Nueva Categoría
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
              onChange={handleNameChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-gray-400">
              Slug
            </label>
            <input
              type="text"
              readOnly
              className="border-b h-10 bg-gray-50 text-gray-400"
              value={formData.slug}
            />
          </div>
          <div className="flex items-center gap-6 pt-4">
            <div className="w-20 h-20 bg-[#FAF7F2] flex items-center justify-center overflow-hidden border border-gray-100">
              {formData.image ? (
                <img
                  src={formData.image}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="text-gray-200" />
              )}
            </div>
            <label className="cursor-pointer border border-[#1F412E] px-4 py-2 text-[10px] font-bold uppercase tracking-widest">
              Subir Imagen
              <input
                type="file"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1F412E] text-white py-4 text-[10px] font-black uppercase tracking-widest mt-8"
          >
            {loading ? (
              <Loader2 className="animate-spin m-auto" size={18} />
            ) : (
              "Crear Categoría"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCategoryCreate;
