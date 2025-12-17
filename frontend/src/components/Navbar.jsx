import { ShoppingCart, User, Menu } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-baby-pink px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo con la fuente Fraunces */}
        <Link
          to="/"
          className="text-2xl font-bold text-black-bean tracking-tight"
        >
          Valle's <span className="text-new-york-pink">Bakery</span>
        </Link>

        {/* Enlaces básicos */}
        <div className="hidden md:flex space-x-8 items-center font-medium">
          <Link to="/" className="hover:text-new-york-pink transition-colors">
            Inicio
          </Link>
          <Link
            to="/productos"
            className="hover:text-new-york-pink transition-colors"
          >
            Pasteles
          </Link>
          <Link
            to="/personalizar"
            className="hover:text-new-york-pink transition-colors"
          >
            Personalizar
          </Link>
        </div>

        {/* Iconos de acción */}
        <div className="flex items-center space-x-5 text-black-bean">
          <button className="hover:text-new-york-pink transition-colors">
            <User size={22} />
          </button>
          <button className="relative hover:text-new-york-pink transition-colors">
            <ShoppingCart size={22} />
            <span className="absolute -top-2 -right-2 bg-new-york-pink text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
              0
            </span>
          </button>
          <button className="md:hidden">
            <Menu size={22} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
