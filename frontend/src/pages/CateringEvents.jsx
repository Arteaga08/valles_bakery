import React from "react";
import { MessageCircle } from "lucide-react";

const CateringEvents = () => {
  const phoneNumber = "526183254920";

  const handleWhatsApp = (type) => {
    let message = "";
    if (type === "wedding") {
      message =
        "¡Hola Vallée! ✨ Me gustaría solicitar una cotización para mi Boda 💍. Me encantaría conocer sus paquetes y opciones de diseño.";
    } else {
      message =
        "¡Hola Vallée! ✨ Estoy interesado en sus servicios de Catering para un evento especial 🧁. ¿Me podrían compartir información?";
    }
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full bg-white-soft animate-fadeIn">
      {/* TÍTULO PRINCIPAL - Estilo Minimalista */}
      <header className="py-10 md:py-16 text-center px-6">
        <span className="text-[#D97E8A] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
          Momentos Especiales
        </span>
        <h1 className="text-5xl md:text-8xl font-serif text-black-bean leading-none">
          Tu Boda, <br className="hidden md:block" /> Catering y Eventos
        </h1>
        <div className="w-12 h-0.5 bg-[#D97E8A] mx-auto mt-10"></div>
      </header>

      {/* SECCIÓN 1: PARA TU BODA (Baby Pink) */}
      <section className="flex flex-col-reverse md:flex-row min-h-150 md:h-187.5">
        {/* Texto (Izquierda) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 py-20 bg-[#E7C0BC] text-black-bean">
          <h2 className="text-6xl md:text-8xl font-serif mb-8 leading-tight italic">
            Para tu Boda
          </h2>
          <p className="text-lg md:text-xl opacity-80 mb-12 font-medium leading-relaxed max-w-lg">
            Los postres de Vallée hacen los regalos más deliciosos, ya sea que
            quieras endulzar el gran día o impresionar a tus invitados. Nuestro
            equipo está listo para ayudarte a encontrar el diseño perfecto.
          </p>
          <div>
            <button
              onClick={() => handleWhatsApp("wedding")}
              className="bg-black-bean text-[#E7C0BC] px-12 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.25em] hover:bg-white-soft hover:text-black-bean transition-all duration-500 shadow-2xl flex items-center gap-4 group"
            >
              <MessageCircle
                size={18}
                className="group-hover:rotate-12 transition-transform"
              />
              Cotizar Boda
            </button>
          </div>
        </div>

        {/* Imagen (Derecha) */}
        <div className="w-full md:w-1/2 relative h-100 md:h-auto overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=2070&auto=format&fit=crop"
            alt="Pastel de Boda Vallée"
            className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
          />
        </div>
      </section>

      {/* SECCIÓN 2: CATERING Y EVENTOS (Verde Magnolia) */}
      <section className="flex flex-col md:flex-row min-h-150 md:h-187.5">
        {/* Imagen (Izquierda) */}
        <div className="w-full md:w-1/2 relative h-100 md:h-auto overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1964&auto=format&fit=crop"
            alt="Catering Vallée"
            className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
          />
        </div>

        {/* Texto (Derecha) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 py-20 bg-[#D1EAD8] text-black-bean">
          <h2 className="text-6xl md:text-8xl font-serif mb-8 leading-tight italic">
            Catering y <br /> Eventos
          </h2>
          <p className="text-lg md:text-xl opacity-80 mb-12 font-medium leading-relaxed max-w-lg">
            Permite que Vallée añada un toque de magia a tu próxima reunión.
            Personalizamos una amplia gama de pasteles, cupcakes y postres
            favoritos en los estilos y colores que desees.
          </p>
          <div>
            <button
              onClick={() => handleWhatsApp("catering")}
              className="bg-black-bean text-[#D1EAD8] px-12 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.25em] hover:bg-white-soft hover:text-black-bean transition-all duration-500 shadow-2xl flex items-center gap-4 group"
            >
              <MessageCircle
                size={18}
                className="group-hover:rotate-12 transition-transform"
              />
              Cotizar Evento
            </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN FINAL: CALL TO ACTION */}
      <footer className="py-24 text-center bg-white">
        <h3 className="text-3xl font-serif text-black-bean mb-4">
          ¿Tienes una idea única?
        </h3>
        <p className="text-black-bean/60 mb-10 font-medium">
          Escríbenos y hagámosla realidad.
        </p>
        <button
          onClick={() => handleWhatsApp("general")}
          className="text-[#D97E8A] font-black uppercase text-xs tracking-widest border-b-2 border-[#D97E8A] pb-2 hover:opacity-50 transition-all"
        >
          Contactar ahora
        </button>
      </footer>
    </div>
  );
};

export default CateringEvents;
