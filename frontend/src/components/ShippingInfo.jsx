import { Truck, ShieldCheck, Clock } from "lucide-react";

const ShippingInfo = () => {
  const features = [
    {
      icon: <Truck size={32} />,
      title: "Envío Local",
      desc: "Entrega segura en toda la zona.",
    },
    {
      icon: <Clock size={32} />,
      title: "Pedidos Anticipados",
      desc: "Mínimo 48 horas de antelación.",
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "Calidad Garantizada",
      desc: "Ingredientes premium siempre.",
    },
  ];

  return (
    <section className="py-16 bg-baby-pink/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center group"
            >
              <div className="mb-4 text-new-york-pink group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h4 className="text-xl font-bold text-black-bean font-fraunces mb-2">
                {f.title}
              </h4>
              <p className="text-cordovan/80 text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShippingInfo;
