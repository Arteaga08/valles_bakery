import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("vallée_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("vallée_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, details, totalPrice) => {
    // 1. DETERMINAR ID Y TIPO DE PRODUCTO
    let itemId;
    let isCustom = false;

    // Si 'details' tiene selectionIds, es un pastel PERSONALIZADO
    if (details && details.selectionIds) {
      const selectionString = Object.values(details.selectionIds).join("-");
      itemId = `${product._id}-${selectionString}`;
      isCustom = true;
    } else {
      // Si no, es un producto NORMAL (donde 'details' es el objeto 'selectedSize')
      const sizeName = details.name || details;
      itemId = `${product._id}-${sizeName}`;
    }

    setCart((prev) => {
      const existing = prev.find((i) => i.id === itemId);

      if (existing) {
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }

      // 2. CONSTRUIR EL OBJETO DEL ITEM
      return [
        ...prev,
        {
          id: itemId,
          productId: product._id,
          name: product.name,
          // Guardamos los sabores/rellenos si existen
          customDetails: isCustom ? details : null,
          // Tamaño para mostrar en el carrito
          size: isCustom ? details.tamaño : details.name || details,
          price: totalPrice,
          // Soporte para imagen única (custom) o array de imágenes (normal)
          image:
            product.image ||
            product.images?.find((img) => img.isMain)?.url ||
            product.images?.[0]?.url,
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
          return { ...item, quantity: newQty >= 1 ? newQty : 1 };
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
    (acc, item) => acc + item.price * item.quantity,
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
