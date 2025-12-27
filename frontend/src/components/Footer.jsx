import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Video, UserLock } from "lucide-react"; // Usamos Video para TikTok o puedes usar los iconos personalizados

const Footer = () => {
  return (
    <footer className="relative bg-white pt-20 border-t border-gray-50">
      {/* Patrón de lunares sutil en la parte superior */}
      <div
        className="absolute top-0 left-0 w-full h-12 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#F7C5CC 20%, transparent 20%)`,
          backgroundSize: "30px 30px",
        }}
      ></div>

      <div className="max-w-350 mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          {/* Columna 1: Marca */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="font-serif text-3xl text-[#1F412E] mb-4">
              Vallée Cupcakes
            </h2>
            <p className="text-[#1F412E] opacity-70 text-sm leading-relaxed max-w-55">
              Horneando momentos especiales desde 2025 con amor y tradición.
            </p>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h3 className="font-bold uppercase tracking-widest text-[10px] text-[#1F412E] mb-6">
              Explora
            </h3>
            <ul className="space-y-4 text-sm text-[#1F412E] font-medium">
              <li>
                <Link
                  to="/productos"
                  className="hover:text-[#e64a85] transition-colors"
                >
                  Menú de Postres
                </Link>
              </li>
              <li>
                <Link
                  to="/eventos"
                  className="hover:text-[#e64a85] transition-colors"
                >
                  Catering & Eventos
                </Link>
              </li>
              <li>
                <Link
                  to="/envios"
                  className="hover:text-[#e64a85] transition-colors"
                >
                  Opciones de Envío
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Datos de Contacto */}
          <div>
            <h3 className="font-bold uppercase tracking-widest text-[10px] text-[#1F412E] mb-6">
              Atención al Cliente
            </h3>
            <ul className="space-y-4 text-sm text-[#1F412E] font-medium">
              <li>Calle Dulzura #123, Ciudad de México</li>
              <li>hola@valleecupcakes.com</li>
              <li>+52 (55) 1234-5678</li>
            </ul>
            <Link
              to="/admin/login"
              className="flex items-center gap-2 text-[#1F412E] opacity-60 hover:opacity-100 hover:text-[#e64a85] transition-all"
            >
              <UserLock size={18} strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-widest font-bold">
                Admin
              </span>
            </Link>
          </div>

          {/* Columna 4: Redes Sociales con Lucide */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-bold uppercase tracking-widest text-[10px] text-[#1F412E] mb-6">
              Síguenos
            </h3>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-[#1F412E] hover:text-[#e64a85] transition-all transform hover:scale-110"
              >
                <Instagram size={22} strokeWidth={1.5} />
              </a>
              <a
                href="#"
                className="text-[#1F412E] hover:text-[#e64a85] transition-all transform hover:scale-110"
              >
                <Facebook size={22} strokeWidth={1.5} />
              </a>
              {/* Para TikTok usamos una versión personalizada o Music/Video de Lucide */}
              <a
                href="#"
                className="text-[#1F412E] hover:text-[#e64a85] transition-all transform hover:scale-110"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-20 pt-8 border-t border-gray-100 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#1F412E] opacity-40">
            © 2025 VALLÉE CUPCAKES - TRADICIÓN EN CADA BOCADO
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
