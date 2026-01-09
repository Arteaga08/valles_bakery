import React from "react";
import {
  MessageCircle,
  Star,
  ChefHat,
  ArrowRight,
  Instagram,
} from "lucide-react";

const SpecialOrders = () => {
  const handleContact = () => {
    const message =
      "Hola Vallée ✨\n\nEstoy interesado en cotizar un *Pastel Personalizado* (Bespoke).\n\nTengo una idea en mente...";
    window.open(
      `https://wa.me/526183254920?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#1F412E]">
      {" "}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Fondo con imagen oscurecida o patrón */}
        <div className="absolute inset-0 z-0">
          {/* Reemplaza esta URL con una foto de un pastel espectacular tuyo */}
          <img
            src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=2070&auto=format&fit=crop"
            alt="Vallée Bespoke Cakes"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-[#1F412E]/30 mix-blend-multiply" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-white">
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-4 text-[#E7C0BC]">
            Vallée Cupcakes
          </p>
          <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight italic">
            Tu imaginación, <br /> nuestro horno.
          </h1>
          <p className="text-sm md:text-lg font-medium opacity-90 max-w-2xl mx-auto mb-10 leading-relaxed">
            Creamos piezas de arte comestible diseñadas exclusivamente para tu
            celebración. Desde bodas hasta momentos irrepetibles.
          </p>
          <button
            onClick={handleContact}
            className="bg-[#FAF7F2] text-[#1F412E] px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-[#D97E8A] hover:text-white transition-all duration-500 shadow-2xl flex items-center gap-3 mx-auto"
          >
            Cotizar mi idea <ArrowRight size={14} />
          </button>
        </div>
      </section>
      {/* CÓMO FUNCIONA */}
      <section className="py-20 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Paso 1 */}
          <div className="bg-white p-10 rounded-[40px] border border-[#1F412E]/5 shadow-sm hover:-translate-y-2 transition-transform duration-500">
            <div className="w-14 h-14 bg-[#FAF7F2] rounded-full flex items-center justify-center mb-6 text-[#D97E8A]">
              <Star size={28} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-2xl mb-4 text-[#1F412E]">
              1. La Idea
            </h3>
            <p className="text-sm text-[#1F412E]/70 leading-relaxed">
              Cuéntanos tu visión. ¿Es una boda, un aniversario o una locura
              creativa? Envíanos referencias, colores y sabores que te inspiren.
            </p>
          </div>

          {/* Paso 2 */}
          <div className="bg-white p-10 rounded-[40px] border border-[#1F412E]/5 shadow-sm hover:-translate-y-2 transition-transform duration-500 md:mt-12">
            <div className="w-14 h-14 bg-[#FAF7F2] rounded-full flex items-center justify-center mb-6 text-[#D97E8A]">
              <ChefHat size={28} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-2xl mb-4 text-[#1F412E]">
              2. El Diseño
            </h3>
            <p className="text-sm text-[#1F412E]/70 leading-relaxed">
              Nuestro equipo de diseño trabajará contigo para proponer una
              estructura, sabores y decoración que se ajusten a tu evento.
            </p>
          </div>

          {/* Paso 3 */}
          <div className="bg-white p-10 rounded-[40px] border border-[#1F412E]/5 shadow-sm hover:-translate-y-2 transition-transform duration-500">
            <div className="w-14 h-14 bg-[#FAF7F2] rounded-full flex items-center justify-center mb-6 text-[#D97E8A]">
              <MessageCircle size={28} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-2xl mb-4 text-[#1F412E]">
              3. Cotización
            </h3>
            <p className="text-sm text-[#1F412E]/70 leading-relaxed">
              Te enviaremos una propuesta formal. Una vez aprobada, agendamos la
              fecha en nuestro calendario de producción exclusivo.
            </p>
          </div>
        </div>
      </section>
      {/* BANNER INSTAGRAM / VISUAL */}
      <section className="py-10 px-4">
        <div className="bg-[#D97E8A] rounded-[40px] text-[#FAF7F2] p-12 md:p-24 text-center relative overflow-hidden">
          {/* Elementos decorativos de fondo */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#D97E8A] opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#E7C0BC] opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <Instagram className="mx-auto mb-6 opacity-50" size={32} />
            <h2 className="font-serif text-3xl md:text-5xl mb-6">
              ¿Necesitas inspiración?
            </h2>
            <p className="text-sm md:text-base opacity-70 mb-10 font-light">
              Visita nuestro Instagram para ver nuestras últimas creaciones
              personalizadas. Cada pastel cuenta una historia diferente.
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-block border border-[#FAF7F2]/30 px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-[#FAF7F2] hover:text-[#1F412E] transition-all duration-300"
            >
              Ver Galería
            </a>
          </div>
        </div>
      </section>
      {/* CTA FINAL */}
      <section className="py-20 text-center px-4">
        <h2 className="font-serif text-4xl text-[#1F412E] mb-2">
          Hablemos de tu pastel
        </h2>
        <p className="text-[#D97E8A] font-bold text-sm mb-8">
          Atención personalizada por WhatsApp
        </p>
        <button
          onClick={handleContact}
          className="bg-[#D97E8A] text-white px-12 py-5 rounded-full font-black uppercase text-[12px] tracking-[0.2em] hover:bg-[#1F412E] transition-colors shadow-xl hover:shadow-2xl transform active:scale-95 duration-200"
        >
          Iniciar Conversación
        </button>
      </section>
    </div>
  );
};

export default SpecialOrders;
