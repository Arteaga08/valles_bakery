import React from "react";
import HeroCarousel from "../components/HeroCarousel"
import CategoriesGrid from "../components/CategoriesGrid";
import ShippingInfo from "../components/ShippingInfo";
import MostSoldProducts from "../components/MostSoldProducts";
import CustomOrders from "../components/CustomOrders";
import { useShop } from "../context/ShopContext";

const Home = () => {
  const { categories, loading: categoriesLoading } = useShop();

  return (
    <div className="flex flex-col w-full bg-white-soft animate-fadeIn">
      {/* 1. El Hero debe estar aquí solo una vez */}
      <HeroCarousel />

      {/* 2. Quitamos el fetch de aquí y solo llamamos al componente. 
             Él ya sabe cargarse solo internamente. */}
      <MostSoldProducts />

      {/* 3. Categorías desde el contexto */}
      <CategoriesGrid categories={categories} loading={categoriesLoading} />

      <ShippingInfo />
      <CustomOrders />
    </div>
  );
};

export default Home;
