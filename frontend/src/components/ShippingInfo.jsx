import React from "react";
import { Link } from "react-router-dom";

const DeliveryOptions = () => {
  const options = [
    {
      title: "Personaliza",
      image:
        "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop",
      bgColor: "bg-[#FFF9C4]", // Amarillo pastel
      patternColor: "#FDE68A",
      url: "/personalizar",
    },
    {
      title: "Para tus fiestas y eventos",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop",
      bgColor: "bg-[#E3F2FD]", // Azul pastel
      patternColor: "#BBDEFB",
      url: "/personalizar",
    },
    {
      title: "Somos parte de tu familia",
      image:
        "https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=800&auto=format&fit=crop",
      bgColor: "bg-[#F3E5F5]", // Morado pastel
      patternColor: "#E1BEE7",
      url: "/personalizar",
    },
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-350 mx-auto text-center">
        {/* Encabezado */}
        <h2 className="text-5xl md:text-6xl font-serif text-[#1F412E] mb-4">
          Peronsaliza tu pedido
        </h2>
        <p className="text-lg text-[#1F412E] font-medium opacity-80 max-w-3xl mx-auto mb-10 leading-relaxed">
          En Vallée Cupcakes te ayudamos a hacer tu idea realidad. Escribenos si
          tienes un pedido personalizable para tus fiestas y eventos
        </p>

        {/* Grid de opciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {options.map((opt, index) => (
            <Link
              to={opt.url}
              key={index}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Contenedor con patrón de diamantes */}
              <div
                className={`relative w-full aspect-square flex items-center justify-center overflow-hidden ${opt.bgColor}`}
              >
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: `radial-gradient(${opt.patternColor} 20%, transparent 20%), radial-gradient(${opt.patternColor} 20%, transparent 20%)`,
                    backgroundPosition: "0 0, 25px 25px",
                    backgroundSize: "50px 50px",
                  }}
                ></div>

                {/* Imagen con marco ondulado / festoneado */}
                <div className="relative z-10 w-[80%] h-[80%] clip-festoneado-soft overflow-hidden bg-white shadow-sm">
                  <img
                    src={opt.image}
                    alt={opt.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </div>

              {/* Título de la opción */}
              <h3 className="mt-6 text-xl font-medium text-[#1F412E] group-hover:underline underline-offset-4">
                {opt.title}
              </h3>
              
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .clip-festoneado-soft {
          /* Clip path que imita la forma de nube/flor de la referencia */
          clip-path: polygon(
            50% 0%,
            61% 2%,
            72% 0%,
            83% 5%,
            91% 12%,
            97% 22%,
            100% 33%,
            98% 44%,
            100% 55%,
            97% 66%,
            92% 77%,
            84% 86%,
            74% 94%,
            63% 98%,
            52% 100%,
            41% 98%,
            30% 94%,
            20% 88%,
            11% 80%,
            5% 70%,
            1% 59%,
            3% 48%,
            0% 37%,
            2% 26%,
            8% 15%,
            18% 7%,
            29% 2%,
            40% 0%
          );
        }
      `}</style>
    </section>
  );
};

export default DeliveryOptions;
