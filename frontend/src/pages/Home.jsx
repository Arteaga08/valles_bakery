import { useState, useEffect } from "react";
import HeroCarousel from "../components/HeroCarousel";
import CategoriesGrid from "../components/CategoriesGrid";
import ShippingInfo from "../components/ShippingInfo";
import MostSoldProducts from "../components/MostSoldProducts";
import CustomOrders from "../components/CustomOrders";
import API from "../service/api";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Llamadas simultáneas a la API para mejor rendimiento
        const [resProducts, resCategories] = await Promise.all([
          API.get("/products"),
          API.get("/categories"),
        ]);

        // Para Favoritos, tomamos los primeros 5 o los que tengan un flag de 'destacado'
        setProducts(resProducts.data.slice(0, 5));
        setCategories(resCategories.data);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando datos de la Home:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white-soft">
        <p className="font-fraunces text-2xl text-new-york-pink animate-pulse">
          Preparando el horno...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-white-soft">
      <HeroCarousel />
      {/* SECCIÓN 2: Productos mas vendidos */}
      <MostSoldProducts />

      {/* SECCIÓN 3: NUESTROS FAVORITOS (EFECTO 3D) */}

      {/* SECCIÓN 3: EXPLORA CATEGORÍAS (GRID EDITORIAL) */}
      <CategoriesGrid categories={categories} />

      {/* SECCIÓN 4: INFORMACIÓN DE VALOR (ENVÍOS Y CALIDAD) */}

      <ShippingInfo />
      <CustomOrders />
    </div>
  );
};

export default Home;
