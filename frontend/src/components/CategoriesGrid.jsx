import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import API from "../service/api";

const CategoriesGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get("/categories");
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center font-fraunces text-new-york-pink text-2xl animate-pulse">
        Cargando delicias...
      </div>
    );

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-black-bean font-fraunces mb-10 border-l-8 border-new-york-pink pl-6">
          Explora por <span className="text-new-york-pink">Categoría</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px]">
          {categories.map((cat, index) => (
            <motion.div
              key={cat._id}
              whileHover={{ scale: 1.02 }}
              // Hacemos que la primera y la cuarta categoría sean más grandes (estilo mosaico)
              className={`relative overflow-hidden rounded-3xl shadow-lg group ${
                index === 0
                  ? "md:col-span-2 md:row-span-2"
                  : index === 3
                  ? "md:col-span-2"
                  : ""
              }`}
            >
              <Link
                to={`/productos?categoria=${
                  cat.slug || cat.name.toLowerCase()
                }`}
              >
                <img
                  src={cat.imageUrl} // Esta URL vendrá de Cloudinary desde tu DB
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black-bean/80 via-transparent to-transparent flex items-end p-8">
                  <h3 className="text-white-soft text-2xl font-bold font-fraunces">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesGrid;
