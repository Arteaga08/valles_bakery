import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Esto fuerza al navegador a ir al inicio cada vez que la ruta cambia
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
