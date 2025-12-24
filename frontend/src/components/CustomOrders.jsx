import React from "react";

const CustomOrders = () => {
  return (
    <section className="relative overflow-hidden bg-[#D1EAD8]">
      <div className="max-w-350 mx-auto flex flex-col md:flex-row items-center min-h-112.5">
        {/* LADO IZQUIERDO: TEXTO (60%) */}
        <div className="w-full md:w-[60%] px-8 md:px-20 py-12 text-center md:text-left z-10">
          <h2 className="text-4xl md:text-6xl font-serif text-[#441C22] mb-6 leading-tight">
            Catering, regalos y eventos
          </h2>
          <p className="text-lg text-[#441C22] font-medium opacity-90 mb-8 max-w-xl">
            Nuestro equipo de catering, regalos y eventos está listo para llenar
            su evento o celebración con una selección personalizada de las
            mejores creaciones de Vallée Cupcakes. ¡Ninguna ocasión es demasiado
            grande ni demasiado pequeña!
          </p>

          <button className="px-10 py-3 bg-[#441C22] text-white font-bold uppercase tracking-widest text-sm rounded-full hover:bg-[#5a252d] transition-colors shadow-md">
            Contactanos
          </button>
        </div>

        {/* LADO DERECHO: RAYAS Y IMAGEN (40%) */}
        <div className="relative w-full md:w-[40%] h-87.5 md:h-full flex items-center justify-center">
          {/* Fondo de rayas verticales */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, #441C22, #441C22 25px, transparent 25px, transparent 50px)`,
            }}
          ></div>

          {/* Imagen con marco festoneado (Scalloped Frame) */}
          <div className="relative z-10 w-64 h-80 md:w-72 md:h-96">
            <div className="absolute inset-0 bg-[#D1EAD8] clip-festoneado transform rotate-2"></div>
            <img
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587"
              alt="Pastel de Evento"
              className="absolute inset-2 w-full h-full object-cover clip-festoneado bg-white"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .clip-festoneado {
          /* Forma simplificada que imita el borde ondulado de la referencia */
          clip-path: polygon(
            50% 0%,
            65% 5%,
            80% 0%,
            95% 5%,
            100% 20%,
            95% 35%,
            100% 50%,
            95% 65%,
            100% 80%,
            95% 95%,
            80% 100%,
            65% 95%,
            50% 100%,
            35% 95%,
            20% 100%,
            5% 95%,
            0% 80%,
            5% 65%,
            0% 50%,
            5% 35%,
            0% 20%,
            5% 5%,
            20% 0%,
            35% 5%
          );
        }
      `}</style>
    </section>
  );
};

export default CustomOrders;
