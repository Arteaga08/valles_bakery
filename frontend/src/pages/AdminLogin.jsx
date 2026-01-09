import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../service/api";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminInfo", JSON.stringify(data));

      navigate("/admin/agenda");
    } catch (err) {
      console.error("Error al iniciar sesión:", err.response?.data);
      setError(err.response?.data?.message || "Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] px-6">
      <div className="w-full max-w-md bg-white p-12 shadow-sm border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl text-[#1F412E] mb-2">
            Panel de Control
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
            Acceso Administrativo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 p-3 rounded border border-red-100">
              <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-tighter">
                {error}
              </p>
            </div>
          )}

          <div>
            <label className="text-[10px] uppercase font-black text-[#1F412E] mb-2 block tracking-widest">
              Email
            </label>
            <input
              type="email"
              className="w-full border-b border-gray-200 py-3 focus:border-[#D97E8A] outline-none transition-colors text-sm bg-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-black text-[#1F412E] mb-2 block tracking-widest">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full border-b border-gray-200 py-3 focus:border-[#D97E8A] outline-none transition-colors text-sm bg-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1F412E] text-white py-5 mt-8 text-[11px] uppercase font-black tracking-[0.2em] hover:bg-[#D97E8A] transition-all duration-300 shadow-xl"
          >
            Entrar al Sistema
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
