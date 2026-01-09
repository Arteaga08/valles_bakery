import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("vallée_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("vallée_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, details, totalPrice) => {
    let itemId;
    let isCustom = false;

    // 1. DETERMINAR ID ÚNICO (Key)
    if (details && details.selectionIds) {
      const selectionString = Object.values(details.selectionIds).join("-");
      itemId = `custom-${product._id}-${selectionString}`;
      isCustom = true;
    } else {
  
      const sizeName = details?.name || details || "standard";
      itemId = `normal-${product._id}-${sizeName}`;
    }

    setCart((prev) => {
      const existing = prev.find((i) => i.id === itemId);

      if (existing) {
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      return [
        ...prev,
        {
          id: itemId,
          productId: product._id,
          name: product.name,
          customDetails: isCustom ? details : null,
          // Tamaño para mostrar en el carrito
          size: isCustom ? details.tamaño : details?.name || details,
          price: Number(totalPrice) || 0, // ✅ Aseguramos que sea número
          // ✅ Lógica de imagen a prueba de errores
          image:
            product.image ||
            (product.images && product.images.length > 0
              ? product.images.find((img) => img.isMain)?.url ||
                product.images[0].url
              : ""),
          quantity: 1,
          isCustom: isCustom,
        },
      ];
    });
  };

  const updateQuantity = (itemId, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: Math.max(1, newQty) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
