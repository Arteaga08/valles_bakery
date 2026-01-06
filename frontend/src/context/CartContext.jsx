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

  const addToCart = (product, selectedSize, totalPrice) => {
    // Generamos un ID único que combine producto + tamaño
    const itemId = `${product._id}-${selectedSize.name}`;

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
          size: selectedSize.name,
          price: totalPrice,
          image:
            product.images.find((img) => img.isMain)?.url ||
            product.images[0]?.url,
          quantity: 1,
        },
      ];
    });
  };

  // NUEVA FUNCIÓN: Para botones + y - en el carrito
  const updateQuantity = (itemId, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newQty = item.quantity + delta;
          // Si es menos de 1, lo dejamos en 1 (o podrías llamar a removeFromCart)
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
        updateQuantity, // <--- Exportamos la nueva función
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
