import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../service/api";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("categoria");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(
    initialCategory || "all"
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resP, resC] = await Promise.all([
          API.get("/products"),
          API.get("/categories"),
        ]);
        setProducts(resP.data);
        setCategories(resC.data);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando datos:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtrado lógico basado en tu CRUD
  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter(
          (p) =>
            p.category === activeCategory || p.category?._id === activeCategory
        );

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-serif text-[#1F412E]">
        Cargando menú...
      </div>
    );

  return (
    <div className="bg-[#FAF7F2] min-h-screen pt-40 pb-20 px-6">
      {" "}
      {/* pt-40 asegura que el Navbar no lo tape */}
      <div className="max-w-350 mx-auto">
        {/* Cabecera Única */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-serif text-[#1F412E] mb-4">
            Nuestro Menú
          </h1>
          <p className="text-[#1F412E] opacity-70 font-medium">
            Explora nuestras delicias horneadas diariamente.
          </p>
        </header>

        {/* Selector de Categorías Único */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <button
            onClick={() => {
              setActiveCategory("all");
              setSearchParams({});
            }}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
              activeCategory === "all"
                ? "bg-[#1F412E] text-white border-[#1F412E]"
                : "text-[#1F412E] border-[#1F412E]/20 hover:border-[#1F412E]"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => {
                setActiveCategory(cat._id);
                setSearchParams({ categoria: cat._id });
              }}
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                activeCategory === cat._id
                  ? "bg-[#1F412E] text-white border-[#1F412E]"
                  : "text-[#1F412E] border-[#1F412E]/20 hover:border-[#1F412E]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid de Productos con marco festoneado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {filteredProducts.map((product) => (
            <div key={product._id} className="group">
              <div className="relative aspect-square mb-6 overflow-hidden bg-white clip-festoneado-menu shadow-sm">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-serif text-[#1F412E] mb-2">
                  {product.name}
                </h3>
                <p className="text-[#e64a85] font-bold text-lg">
                  ${product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .clip-festoneado-menu {
          clip-path: polygon(
            50% 0%,
            61% 2%,
            72% 0%,
            83% 5%,
            91% 12%,
            97% 22%,
            100% 33%,
            98% 44%,
            100% 55%,
            97% 66%,
            92% 77%,
            84% 86%,
            74% 94%,
            63% 98%,
            52% 100%,
            41% 98%,
            30% 94%,
            20% 88%,
            11% 80%,
            5% 70%,
            1% 59%,
            3% 48%,
            0% 37%,
            2% 26%,
            8% 15%,
            18% 7%,
            29% 2%,
            40% 0%
          );
        }
      `}</style>
    </div>
  );
};

export default Products;
