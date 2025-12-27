import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Calendar,
  Package,
  Layers,
  Sparkles,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const navItems = [
    { name: "Agenda", path: "/admin/agenda", icon: <Calendar size={18} /> },
    {
      name: "Productos",
      path: "/admin/productos",
      icon: <Package size={18} />,
    },
    {
      name: "Categorías",
      path: "/admin/categorias",
      icon: <Layers size={18} />,
    },
    { name: "Custom", path: "/admin/custom", icon: <Sparkles size={18} /> },
  ];

  return (
  <>
    {/* HEADER MÓVIL */}
    <div className="lg:hidden sticky top-0 left-0 w-full bg-white border-b border-gray-100 p-4 z-50 flex justify-between items-center">
      <h2 className="font-serif text-xl text-[#1F412E]">Vallée Admin</h2>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-[#1F412E] p-2"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>

    {/* SIDEBAR */}
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-100 p-8
        flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:block
      `}
    >
      <div className="mb-12 hidden lg:block">
        <h2 className="font-serif text-2xl text-[#1F412E]">
          Vallée Cupcakes
        </h2>
        <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 font-bold mt-1">
          Management Panel
        </p>
      </div>

      <nav className="flex-1 space-y-3 mt-16 lg:mt-0">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 text-[10px] uppercase tracking-[0.2em] font-black transition-all border-l-4 ${
                isActive
                  ? "bg-[#F7C5CC]/10 border-[#e64a85] text-[#1F412E]"
                  : "border-transparent text-gray-400 hover:text-[#e64a85]"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-4 px-5 py-4 text-[10px] uppercase tracking-[0.2em] font-black text-red-400 hover:text-red-600 transition-all mt-auto border-l-4 border-transparent"
      >
        <LogOut size={18} />
        Cerrar Sesión
      </button>
    </aside>

    {/* OVERLAY MÓVIL */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
        onClick={() => setIsOpen(false)}
      />
    )}
  </>
);
}

export default AdminSidebar;
