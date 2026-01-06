import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import {
  Trash2,
  Calendar as CalendarIcon,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import Calendar from "react-calendar";
import API from "../service/api";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const navigate = useNavigate()
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [selectedDate, setSelectedDate] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const [customerName, setCustomerName] = useState("");

  // Consultar disponibilidad de la agenda
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const { data } = await API.get("/orders/admin"); // Usamos el endpoint que ya tienes

        // Agrupamos órdenes por fecha para ver cuáles tienen 5 o más
        const counts = data.reduce((acc, order) => {
          const date = order.deliveryDate.split("T")[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        const fullDates = Object.keys(counts).filter(
          (date) => counts[date] >= 5
        );
        setBlockedDates(fullDates);
      } catch (err) {
        console.error("Error al consultar agenda");
      }
    };
    fetchAvailability();
  }, []);

  const isDayDisabled = ({ date }) => {
    const dateStr = format(date, "yyyy-MM-dd");
    // Bloquear si está lleno, si es domingo (opcional) o si es pasado
    return (
      blockedDates.includes(dateStr) || date < new Date().setHours(0, 0, 0, 0)
    );
  };

  const handleWhatsApp = () => {
    const productsText = cart
      .map((item) => `• ${item.quantity}x ${item.name} (${item.size})`)
      .join("\n");

    const message = `¡Hola Vallée! ✨\n\nMi nombre es *${customerName}*.\nMe gustaría confirmar mi pedido:\n${productsText}\n\n📅 *Fecha de recolección:* ${format(
      selectedDate,
      "dd/MM/yyyy"
    )}\n💰 *Total:* $${cartTotal}\n\n¿Me podrían confirmar los detalles para el pago?`;

    window.open(
      `https://wa.me/526183254920?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-black-bean">
        <ShoppingBag size={80} className="mb-6 opacity-20" />
        <h2 className="text-3xl font-serif">Tu bolsa está vacía</h2>
        <a
          href="/productos"
          className="mt-4 text-[#D97E8A] font-black uppercase tracking-widest text-sm"
        >
          Volver a la tienda
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
      <button
        onClick={() => navigate("/productos")}
        className="flex items-center gap-2 text-black-bean/50 font-black uppercase text-[10px] tracking-widest mb-8 hover:text-[#D97E8A] transition-colors group"
      >
        <ArrowLeft
          size={14}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Seguir comprando
      </button>

      <h1 className="text-5xl md:text-7xl font-serif text-black-bean mb-16 text-center italic">
        Tu Pedido
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* COLUMNA IZQUIERDA: PRODUCTOS */}
        <div className="space-y-8">
          <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-black-bean border-b pb-4">
            1. Resumen de compra
          </h3>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-6 items-center bg-white p-4 rounded-4xl shadow-sm border border-black-bean/5"
            >
              <img
                src={item.image}
                className="w-24 h-24 rounded-3xl object-cover"
              />

              <div className="flex-1">
                <h4 className="font-serif text-xl text-black-bean">
                  {item.name}
                </h4>
                <p className="text-[10px] font-black text-[#D97E8A] uppercase tracking-wider">
                  {item.size}
                </p>

                {/* CONTROLES DE CANTIDAD */}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center border border-black-bean/10 rounded-full bg-[#FAF7F2]">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-3 py-1 text-black-bean hover:text-[#D97E8A] font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="text-xs font-black w-6 text-center text-black-bean">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-3 py-1 text-black-bean hover:text-[#D97E8A] font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <p className="font-bold text-black-bean text-sm">
                    ${item.price * item.quantity}
                  </p>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="p-4 text-black-bean/20 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <div className="pt-6 flex justify-between items-end">
            <p className="text-black-bean/50 font-bold uppercase text-xs">
              Total estimado
            </p>
            <p className="text-5xl font-serif text-black-bean">${cartTotal}</p>
          </div>
        </div>

        {/* COLUMNA DERECHA: AGENDA Y DATOS */}
        <div className="space-y-10">
          <section>
            <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-black-bean mb-6 flex items-center gap-2">
              <CalendarIcon size={14} /> 2. Fecha de Recolección
            </h3>
            <div className="bg-white p-6 rounded-[40px] shadow-xl border border-[#E7C0BC]/30">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileDisabled={isDayDisabled}
                className="vallée-full-calendar"
              />
            </div>
            <p className="text-[10px] text-black-bean/40 mt-4 italic">
              * Los días en gris no tienen disponibilidad de horno.
            </p>
          </section>

          <section>
            <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-black-bean mb-6">
              3. ¿A nombre de quién?
            </h3>
            <input
              type="text"
              placeholder="NOMBRE COMPLETO"
              className="w-full bg-white border-2 border-[#E7C0BC] p-6 rounded-2xl outline-none focus:border-[#D97E8A] font-serif text-xl transition-all"
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </section>

          <button
            disabled={!selectedDate || !customerName}
            onClick={handleWhatsApp}
            className="w-full bg-black-bean text-[#E7C0BC] py-8 rounded-4xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-[#D97E8A] hover:text-white transition-all duration-500 disabled:opacity-20 shadow-2xl shadow-black-bean/20"
          >
            Confirmar Pedido <ArrowRight size={20} />
          </button>
        </div>
      </div>

      <style jsx global>{`
        .vallée-full-calendar {
          border: none !important;
          width: 100% !important;
          background: transparent !important;
          font-family: inherit !important;
        }
        .react-calendar__tile--active {
          background: #370808 !important;
          border-radius: 12px;
          color: #e7c0bc !important;
        }
        .react-calendar__tile--now {
          background: #e7c0bc !important;
          border-radius: 12px;
          color: #370808 !important;
        }
        .react-calendar__tile:disabled {
          background: #f0f0f0 !important;
          color: #ccc !important;
          text-decoration: line-through;
        }
      `}</style>
    </div>
  );
};

export default CartPage;
