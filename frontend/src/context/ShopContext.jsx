import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../service/api";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // 1. Intentamos leer de la caché para carga instantánea
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("vallee_categories");
    return saved ? JSON.parse(saved) : [];
  });

  const [heroSlides, setHeroSlides] = useState(() => {
    const saved = localStorage.getItem("vallee_hero");
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(categories.length === 0);

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        // Ejecución en paralelo
        const [resCats, resHero] = await Promise.all([
          API.get("/categories"),
          API.get("/hero-slides"),
        ]);

        const catsData = resCats.data || [];
        const heroData = resHero.data || [];

        // 2. Guardamos en estado y en caché para la próxima visita
        setCategories(catsData);
        setHeroSlides(heroData);

        localStorage.setItem("vallee_categories", JSON.stringify(catsData));
        localStorage.setItem("vallee_hero", JSON.stringify(heroData));
      } catch (error) {
        console.error("Error cargando datos globales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalData();
  }, []);

  return (
    <ShopContext.Provider value={{ categories, heroSlides, loading }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
