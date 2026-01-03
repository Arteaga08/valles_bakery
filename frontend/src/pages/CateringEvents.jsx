import React from "react";
import { MessageCircle } from "lucide-react";

const CateringEvents = () => {
  const phoneNumber = "526183254920"; // Reemplaza con el número real de la dueña

  const handleWhatsApp = (type) => {
    let message = "";
    if (type === "wedding") {
      message =
        "Hola Vallée, estoy interesado en una cotización para una Boda 💍.";
    } else {
      message =
        "Hola Vallée, estoy interesado en servicios de Catering y Eventos 🧁.";
    }
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full bg-white-soft">
      {/* TÍTULO PRINCIPAL DE LA PÁGINA */}
      <header className="py-16 md:py-24 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-serif text-black-bean uppercase tracking-normal">
          Tu boda, <br />catering y eventos
        </h1>
        <div className="w-20 h-1 bg-[#D97E8A] mx-auto mt-6"></div>
      </header>

      {/* SECCIÓN 1: PARA TU BODA (Baby Pink) */}
      <section className="flex flex-col-reverse md:flex-row min-h-125 md:h-150">
        {/* Texto (Izquierda) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 py-16 bg-[#E7C0BC]">
          <h2 className="text-5xl md:text-7xl font-serif text-black-bean mb-6 leading-none">
            Para tu Boda
          </h2>
          <p className="text-lg text-black-bean/80 mb-10 font-medium leading-relaxed">
            Los postres de Vallée hacen los regalos más deliciosos, ya sea que
            quieras endulzar el gran día o impresionar a tus invitados. Nuestro
            equipo está listo para ayudarte a encontrar el diseño perfecto.
          </p>
          <div>
            <button
              onClick={() => handleWhatsApp("wedding")}
              className="bg-black-bean text-[#E7C0BC] px-10 py-4 rounded-full text-sm font-black uppercase tracking-[0.2em] hover:bg-[#FAF7F2] hover:text-black-bean transition-all duration-300 shadow-xl flex items-center gap-3"
            >
              <MessageCircle size={18} />
              Cotizar Boda
            </button>
          </div>
        </div>

        {/* Imagen (Derecha) */}
        <div className="w-full md:w-1/2 relative h-100 md:h-auto">
          <img
            src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=2070&auto=format&fit=crop"
            alt="Pastel de Boda Vallée"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </section>

      {/* SECCIÓN 2: CATERING Y EVENTOS (Verde Magnolia) */}
      <section className="flex flex-col md:flex-row min-h-125 md:h-150">
        {/* Imagen (Izquierda) */}
        <div className="w-full md:w-1/2 relative h-100 md:h-auto">
          <img
            src="https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1964&auto=format&fit=crop"
            alt="Catering Vallée"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Texto (Derecha) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24 py-16 bg-[#D1EAD8]">
          <h2 className="text-5xl md:text-7xl font-serif text-black-bean mb-6 leading-none">
            Catering y <br />
            Eventos
          </h2>
          <p className="text-lg text-black-bean/80 mb-10 font-medium leading-relaxed">
            Permite que Vallée añada un toque de magia a tu próxima reunión.
            Personalizamos una amplia gama de pasteles, cupcakes y postres
            favoritos en los estilos y colores que desees.
          </p>
          <div>
            <button
              onClick={() => handleWhatsApp("catering")}
              className="bg-black-bean text-[#D1EAD8] px-10 py-4 rounded-full text-sm font-black uppercase tracking-[0.2em] hover:bg-[#FAF7F2] hover:text-black-bean transition-all duration-300 shadow-xl flex items-center gap-3"
            >
              <MessageCircle size={18} />
              Cotizar Evento
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CateringEvents;
