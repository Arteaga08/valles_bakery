import HeroCarousel from "../components/HeroCarousel";
import FavoritesWheel from "../components/FavoritesWheel";
import CategoriesGrid from "../components/CategoriesGrid";
import ShippingInfo from "../components/ShippingInfo";

const Home = () => {
  return (
    <div className="flex flex-col w-full">
      {/* SECCIÓN 1: CARRUSEL HERO */}
      <HeroCarousel />

      {/* SECCIÓN 2: ROTATING WHEEL (FAVORITOS) */}
      {/* Usamos el color Baby Pink de fondo aquí para contraste */}
      <div className="bg-baby-pink/30">
        <FavoritesWheel />
      </div>

      {/* SECCIÓN 3: CATEGORÍAS */}
      <CategoriesGrid />

      {/* SECCIÓN 4: MÉTODOS DE ENVÍO */}
      <ShippingInfo />
    </div>
  );
};

export default Home;
