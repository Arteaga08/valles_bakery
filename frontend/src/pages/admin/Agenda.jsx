import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Phone,
  Clock,
  DollarSign,
  CheckCircle2,
  StickyNote,
} from "lucide-react";
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  addWeeks,
  subWeeks,
  endOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [orders, setOrders] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const scrollContainerRef = useRef(null);

  const [newOrder, setNewOrder] = useState({
    customerName: "",
    customerPhone: "",
    deliveryDate: format(new Date(), "yyyy-MM-dd"),
    deliveryTime: "",
    amountPaid: 0,
    paymentMethod: "Transfer",
    items: [],
    adminNotes: "",
  });

  // Función para convertir hora 24h a 12h AM/PM
  const formatTime12h = (time24) => {
    if (!time24) return "";
    const [hour, minute] = time24.split(":");
    const h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${minute} ${ampm}`;
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
    fetchOrders();
    fetchProducts();
  }, [currentDate]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("adminToken");
    const { data } = await axios.get("http://localhost:5002/api/orders/admin", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(data);
  };

  const fetchProducts = async () => {
    const { data } = await axios.get("http://localhost:5002/api/products");
    setAvailableProducts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSpecialOrder = newOrder.items.some((it) =>
      it.name.toLowerCase().includes("boda")
    );
    const total = newOrder.items.reduce((acc, it) => acc + it.finalPrice, 0);

    const payload = {
      ...newOrder,
      totalPrice: total,
      deliveryMethod: isSpecialOrder ? "Delivery" : "Pickup",
      items: newOrder.items.map((it) => ({
        productId: it.productId,
        name: it.name,
        quantity: it.quantity,
        unitPrice: it.finalPrice,
        finalPrice: it.finalPrice,
        type: "Standard",
      })),
    };

    try {
      const token = localStorage.getItem("adminToken");
      await axios.post("http://localhost:5002/api/orders", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowCreateModal(false);
      resetNewOrder();
      fetchOrders();
    } catch (err) {
      alert("Error al crear pedido");
    }
  };

  const markAsCompleted = async (orderId) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `http://localhost:5002/api/orders/${orderId}/status`,
        { status: "Completed" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      alert("Error al actualizar estado");
    }
  };

  const resetNewOrder = () => {
    setNewOrder({
      customerName: "",
      customerPhone: "",
      deliveryDate: format(new Date(), "yyyy-MM-dd"),
      deliveryTime: "",
      amountPaid: 0,
      paymentMethod: "Transfer",
      items: [],
      adminNotes: "",
    });
  };

  const handlePrevWeek = () =>
    setCurrentDate((prev) =>
      startOfWeek(subWeeks(prev, 1), { weekStartsOn: 1 })
    );
  const handleNextWeek = () =>
    setCurrentDate((prev) =>
      startOfWeek(addWeeks(prev, 1), { weekStartsOn: 1 })
    );

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekRange = `${format(weekStart, "d")} - ${format(
    endOfWeek(currentDate, { weekStartsOn: 1 }),
    "d 'de' MMMM",
    { locale: es }
  )}`;
  const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));

  const getStatusBadge = (order) => {
    if (order.status === "Completed")
      return {
        label: "ENTREGADO",
        css: "bg-gray-100 text-gray-500 border-gray-200",
      };
    if (order.amountPaid >= order.totalPrice)
      return {
        label: "PAGADO",
        css: "bg-green-100 text-green-700 border-green-200",
      };
    if (order.amountPaid > 0)
      return {
        label: `ANTICIPO $${order.amountPaid}`,
        css: "bg-orange-100 text-orange-700 border-orange-200",
      };
    return {
      label: "PENDIENTE",
      css: "bg-red-100 text-red-700 border-red-200",
    };
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-10">
      {/* HEADER */}
      <div className="bg-white p-6 border-b flex flex-col md:flex-row justify-between items-center sticky top-0 z-30 gap-4 shadow-sm">
        <div className="text-center md:text-left">
          <h1 className="font-serif text-3xl md:text-4xl text-[#1F412E]">
            Agenda Vallée
          </h1>
          <div className="mt-1">
            <p className="text-[#e64a85] font-black uppercase text-[10px] tracking-[0.2em]">
              {format(currentDate, "MMMM yyyy", { locale: es })}
            </p>
            <p className="text-[#1F412E] font-bold text-xs">
              Semana: {weekRange}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <button
              onClick={handlePrevWeek}
              className="p-3 border rounded-full bg-white active:scale-90 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNextWeek}
              className="p-3 border rounded-full bg-white active:scale-90 transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#1F412E] text-white px-6 py-4 rounded-full font-black text-[10px] uppercase flex items-center gap-2 shadow-lg"
          >
            <Plus size={16} /> Nueva Orden
          </button>
        </div>
      </div>

      {/* GRID CALENDARIO */}
      <div
        ref={scrollContainerRef}
        className="flex md:grid md:grid-cols-7 overflow-x-auto bg-white border-b scrollbar-hide snap-x snap-mandatory"
      >
        {weekDays.map((day, i) => (
          <div
            key={i}
            className="min-w-[85vw] md:min-w-0 min-h-175 border-r border-gray-50 p-3 snap-start"
          >
            <div
              className={`text-center py-4 mb-6 rounded-3xl ${
                isSameDay(day, new Date())
                  ? "bg-[#e64a85] text-white shadow-lg"
                  : "bg-[#FAF7F2] text-[#1F412E]"
              }`}
            >
              <p className="text-[10px] font-black uppercase opacity-60">
                {format(day, "EEEE", { locale: es })}
              </p>
              <p className="text-4xl font-serif">{format(day, "d")}</p>
            </div>
            <div className="space-y-4 px-2">
              {orders
                .filter((o) => isSameDay(new Date(o.deliveryDate), day))
                .map((order) => {
                  const badge = getStatusBadge(order);
                  return (
                    <div
                      key={order._id}
                      onClick={() => setSelectedOrder(order)}
                      className={`bg-white border-2 p-4 rounded-2xl shadow-sm transition-all cursor-pointer ${
                        order.status === "Completed"
                          ? "opacity-40 grayscale border-gray-100"
                          : "border-gray-100 hover:border-[#e64a85]"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-[10px] font-black text-[#e64a85] flex items-center gap-1">
                          <Clock size={12} />{" "}
                          {formatTime12h(order.deliveryTime)}
                        </p>
                      </div>
                      <h4 className="text-[12px] font-black text-[#1F412E] uppercase mb-3 wrap-break-word leading-tight">
                        {order.customerName}
                      </h4>
                      <div
                        className={`text-[9px] font-black py-2 px-2 text-center rounded-lg border ${badge.css}`}
                      >
                        {badge.label}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DETALLE CON NOTAS VISIBLES */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F412E]/80 backdrop-blur-md"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 bg-[#FAF7F2] flex justify-between items-start border-b">
              <div>
                <h2 className="font-serif text-3xl text-[#1F412E]">
                  {selectedOrder.customerName}
                </h2>
                <p className="text-[#e64a85] font-bold mt-1">
                  {selectedOrder.customerPhone}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-white rounded-full"
              >
                <X />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-3xl">
                  <p className="text-[9px] font-black text-gray-400 uppercase">
                    Hora de Entrega
                  </p>
                  <p className="font-serif text-xl text-[#1F412E]">
                    {formatTime12h(selectedOrder.deliveryTime)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-3xl text-right">
                  <p className="text-[9px] font-black text-gray-400 uppercase">
                    Total
                  </p>
                  <p className="font-serif text-xl text-[#1F412E]">
                    ${selectedOrder.totalPrice}
                  </p>
                </div>
              </div>

              {/* BLOQUE DE NOTAS DE PRODUCCIÓN */}
              {selectedOrder.adminNotes && (
                <div className="bg-amber-50 p-5 rounded-3xl border border-amber-100">
                  <p className="text-[9px] font-black text-amber-600 uppercase mb-2 flex items-center gap-2">
                    <StickyNote size={12} /> Notas de Producción
                  </p>
                  <p className="text-sm italic text-amber-900 leading-relaxed">
                    "{selectedOrder.adminNotes}"
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-400 uppercase border-b pb-1">
                  Productos
                </p>
                {selectedOrder.items.map((it, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-xs font-bold text-[#1F412E] py-1"
                  >
                    <span>
                      {it.quantity}x {it.name}
                    </span>
                    <span>${it.finalPrice}</span>
                  </div>
                ))}
              </div>

              {selectedOrder.status !== "Completed" && (
                <button
                  onClick={() => markAsCompleted(selectedOrder._id)}
                  className="w-full bg-[#1F412E] text-white py-4 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2 shadow-lg hover:bg-green-700 transition-all"
                >
                  <CheckCircle2 size={16} /> Marcar como Entregado
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-[#1F412E]/90 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[95vh] rounded-[40px] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 md:p-8 border-b flex justify-between bg-[#FAF7F2]">
              <h2 className="font-serif text-2xl text-[#1F412E]">
                Nueva Orden
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetNewOrder();
                }}
              >
                <X />
              </button>
            </div>
            <div className="p-6 md:p-10 grow overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <input
                  placeholder="NOMBRE CLIENTE"
                  className="w-full border-b-2 p-2 outline-none font-serif text-2xl focus:border-[#e64a85]"
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, customerName: e.target.value })
                  }
                />
                <input
                  placeholder="WHATSAPP"
                  className="w-full border-b p-2 outline-none font-bold text-sm"
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, customerPhone: e.target.value })
                  }
                />
                <div className="flex gap-4">
                  <input
                    type="date"
                    className="w-1/2 border-b p-2 outline-none"
                    value={newOrder.deliveryDate}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, deliveryDate: e.target.value })
                    }
                  />
                  <input
                    type="time"
                    className="w-1/2 border-b p-2 outline-none"
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, deliveryTime: e.target.value })
                    }
                  />
                </div>
                <div className="bg-green-50 p-4 rounded-[20px] border border-green-100 flex items-center gap-3">
                  <DollarSign size={20} className="text-green-600" />
                  <input
                    type="number"
                    placeholder="ANTICIPO"
                    className="bg-transparent w-full outline-none font-black text-green-700"
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        amountPaid: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <textarea
                  placeholder="NOTAS DE PRODUCCIÓN..."
                  className="w-full border p-4 rounded-2xl h-24 text-sm outline-none focus:border-[#e64a85]"
                  onChange={(e) =>
                    setNewOrder({ ...newOrder, adminNotes: e.target.value })
                  }
                />
              </div>
              <div className="bg-[#FAF7F2] rounded-4xl p-6 border border-gray-100 overflow-y-auto max-h-100">
                <div className="space-y-2">
                  {availableProducts.map((p) => (
                    <button
                      key={p._id}
                      onClick={() =>
                        setNewOrder({
                          ...newOrder,
                          items: [
                            ...newOrder.items,
                            {
                              productId: p._id,
                              name: p.name,
                              quantity: 1,
                              finalPrice: p.price,
                            },
                          ],
                        })
                      }
                      className="w-full bg-white p-4 rounded-xl shadow-sm border border-transparent hover:border-[#e64a85] flex justify-between items-center group active:scale-95 transition-all"
                    >
                      <span className="font-bold text-[10px] uppercase text-[#1F412E]">
                        {p.name}
                      </span>
                      <span className="font-serif text-[#e64a85]">
                        ${p.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-8 border-t flex flex-col md:flex-row justify-between items-center bg-white gap-4 shadow-inner">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-black text-gray-400 uppercase">
                  Total Pedido
                </p>
                <p className="text-4xl font-serif text-[#1F412E]">
                  ${newOrder.items.reduce((acc, it) => acc + it.finalPrice, 0)}
                </p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetNewOrder();
                  }}
                  className="flex-1 md:flex-none border-2 px-10 py-4 rounded-full font-black uppercase text-[10px] hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 md:flex-none bg-[#1F412E] text-white px-14 py-4 rounded-full font-black uppercase text-[10px] shadow-xl hover:bg-[#e64a85] transition-all"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agenda;
