import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Menu,
  X,
  Instagram,
  Facebook,
  Mail,
  CakeSlice,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../service/api";
import { useCart } from "../context/CartContext"; // 1. Importamos el hook del carrito

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart(); // 2. Obtenemos el estado del carrito

  // Calculamos el total de productos (sumando cantidades)
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await API.get("/categories");
        setCategories(data);
      } catch (error) {
        console.error("Error en Navbar:", error);
      }
    };
    fetchCats();
  }, []);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* BOTÓN MENÚ */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-black-bean p-1.5 border border-black-bean rounded-full hover:bg-gray-50 transition-colors z-50"
        >
          {isOpen ? <X size={16} /> : <Menu size={16} />}
        </button>

        {/* LOGO */}
        <Link to="/" className="flex flex-col items-center group">
          <h1 className="text-2xl md:text-3xl font-bold font-fraunces leading-tight tracking-tighter">
            <span className="text-black-bean">VALLÉE</span>{" "}
            <span className="text-new-york-pink italic font-serif font-light">
              Cupcakes
            </span>
          </h1>
        </Link>

        {/* CARRITO - Transformado en Link y Dinámico */}
        <Link
          to="/carrito"
          className="relative p-1.5 border border-black-bean rounded-full hover:bg-gray-50 transition-colors"
        >
          <ShoppingCart size={16} className="text-black-bean" />

          {/* Solo mostramos la burbuja si hay productos */}
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={totalItems} // Esto hace que "salte" cuando cambia el número
              className="absolute -top-1.5 -right-1.5 bg-new-york-pink text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white"
            >
              {totalItems}
            </motion.span>
          )}
        </Link>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* OVERLAY Y SIDEBAR SE MANTIENEN IGUAL... */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black-bean/40 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-75 bg-white z-50 flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-sm tracking-[0.3em] text-black-bean font-bold mb-1">
                  BIENVENIDO A
                </h2>
                <p className="font-fraunces text-2xl text-black-bean">
                  Vallée{" "}
                  <span className="text-new-york-pink italic">Cupcakes</span>
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 font-fraunces">
                <div className="space-y-4">
                  <Link
                    to="/"
                    onClick={() => setIsOpen(false)}
                    className="block text-2xl text-black-bean hover:text-new-york-pink transition-colors"
                  >
                    Inicio
                  </Link>
                  {/* Link al carrito dentro del menú también */}
                  <Link
                    to="/carrito"
                    onClick={() => setIsOpen(false)}
                    className="block text-2xl text-black-bean hover:text-new-york-pink transition-colors"
                  >
                    Mi Carrito ({totalItems})
                  </Link>
                  <Link
                    to="/personalizar"
                    onClick={() => setIsOpen(false)}
                    className="block text-2xl text-black-bean hover:text-new-york-pink transition-colors"
                  >
                    Pedidos Especiales
                  </Link>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-6">
                    Nuestras Delicias
                  </p>
                  <div className="space-y-5">
                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/productos?categoria=${cat.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex justify-between items-center text-lg text-black-bean group py-1"
                      >
                        <span className="group-hover:text-new-york-pink transition-colors duration-300">
                          {cat.name}
                        </span>
                        <div className="h-px flex-1 mx-4 bg-gray-100 group-hover:bg-new-york-pink/30 transition-all duration-500" />
                        <div className="text-new-york-pink opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                          <CakeSlice size={18} strokeWidth={2.5} />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-100 bg-gray-50/30">
                <div className="flex justify-center space-x-6 text-black-bean">
                  <a
                    href="#"
                    className="hover:text-new-york-pink transition-colors"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="#"
                    className="hover:text-new-york-pink transition-colors"
                  >
                    <Facebook size={20} />
                  </a>
                  <a
                    href="#"
                    className="hover:text-new-york-pink transition-colors"
                  >
                    <Mail size={20} />
                  </a>
                </div>
                <p className="text-[9px] text-center text-gray-400 mt-6 tracking-widest uppercase">
                  Vallée Cupcakes &copy; 2025
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
