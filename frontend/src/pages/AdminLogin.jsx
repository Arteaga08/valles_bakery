import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // URL CORREGIDA: Puerto 50002 y ruta /api/auth/login
      const { data } = await axios.post(
        "http://localhost:5002/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminInfo", JSON.stringify(data));

      navigate("/admin/agenda");
    } catch (err) {
      console.error("Error detallado:", err.response?.data);
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] px-6">
      <div className="w-full max-w-md bg-white p-12 shadow-sm border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl text-[#1F412E] mb-2">
            Panel de Control
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">
            Sólo personal autorizado
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}

          <div>
            <label className="text-[10px] uppercase font-bold text-[#1F412E] mb-2 block">
              Email
            </label>
            <input
              type="email"
              className="w-full border-b border-gray-300 py-3 focus:border-[#e64a85] outline-none transition-colors text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-[#1F412E] mb-2 block">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full border-b border-gray-300 py-3 focus:border-[#e64a85] outline-none transition-colors text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1F412E] text-white py-4 mt-8 text-[11px] uppercase font-bold tracking-widest hover:bg-[#e64a85] transition-all duration-300 shadow-lg shadow-gray-200"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
