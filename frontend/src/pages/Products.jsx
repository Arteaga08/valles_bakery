import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronUp, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../service/api";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});

  const MAX_VISIBLE_ITEMS = 5;

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

  useEffect(() => {
    const catId = searchParams.get("categoria");
    if (catId && !loading) {
      scrollToCategory(catId);
    }
  }, [searchParams, loading]);

  const scrollToCategory = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const toggleSection = (catId) => {
    setExpandedSections((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const sections = categories
    .map((cat) => {
      const catProducts = products.filter(
        (p) => p.category === cat._id || p.category?._id === cat._id
      );
      return { ...cat, items: catProducts };
    })
    .filter((section) => section.items.length > 0);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAF7F2] text-[#1F412E] font-black uppercase tracking-widest">
        Cargando Menú Vallée...
      </div>
    );

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-20">
      {/* NAVEGACIÓN CATEGORÍAS */}
      <div className="sticky top-20 z-40 bg-[#FAF7F2]/95 backdrop-blur-md pt-4 pb-6 mb-8 border-none shadow-none outline-none">
        <div className="max-w-350 mx-auto px-6 overflow-x-auto no-scrollbar">
          <div className="flex gap-8 md:justify-center min-w-max">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => scrollToCategory(cat._id)}
                className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#1F412E] hover:text-[#e64a85] transition-colors whitespace-nowrap"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-350 mx-auto px-4 md:px-8">
        <header className="text-center mb-16 pt-10">
          <h1 className="text-5xl md:text-7xl font-serif text-[#1F412E] mb-4">
            Nuestro Menú
          </h1>
          <div className="w-16 h-1 bg-[#e64a85] mx-auto"></div>
        </header>

        <div className="space-y-24">
          {sections.map((section) => {
            const isExpanded = expandedSections[section._id];
            const visibleItems = isExpanded
              ? section.items
              : section.items.slice(0, MAX_VISIBLE_ITEMS);
            const remainingCount = section.items.length - MAX_VISIBLE_ITEMS;

            return (
              <div
                key={section._id}
                id={section._id}
                className="flex flex-col lg:flex-row gap-8 lg:gap-16 border-t border-[#1F412E]/10 pt-16"
              >
                {/* SIDEBAR CATEGORÍA */}
                <div className="lg:w-1/4">
                  <div className="sticky top-48">
                    <h2 className="text-3xl font-black text-[#1F412E] uppercase mb-4 tracking-tighter">
                      {section.name}
                    </h2>
                    <p className="text-[#1F412E] opacity-70 text-sm leading-relaxed mb-6 font-medium">
                      {section.description ||
                        `Nuestra selección premium de ${section.name.toLowerCase()}.`}
                    </p>
                  </div>
                </div>

                {/* GRID DE PRODUCTOS */}
                <div className="lg:w-3/4">
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-2 md:gap-x-6 gap-y-10 md:gap-y-16">
                    {visibleItems.map((product) => {
                      const mainImageObj =
                        product.images?.find((img) => img.isMain) ||
                        product.images?.[0];
                      const mainImageUrl = mainImageObj ? mainImageObj.url : "";
                      const hoverImageObj =
                        product.images?.find((img) => !img.isMain) ||
                        mainImageObj;
                      const hoverImageUrl = hoverImageObj
                        ? hoverImageObj.url
                        : mainImageUrl;

                      return (
                        <Link
                          key={product._id}
                          to={`/productos/${product.slug}`}
                          className="flex flex-col h-full group bg-white rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
                        >
                          {/* FOTO */}
                          <div className="relative aspect-4/5 overflow-hidden rounded-xl mb-4 bg-gray-50">
                            <img
                              src={mainImageUrl}
                              alt={product.name}
                              className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-500 group-hover:opacity-0"
                            />
                            <img
                              src={hoverImageUrl}
                              alt="Hover"
                              className="absolute inset-0 w-full h-full object-cover z-0"
                            />
                          </div>

                          {/* INFO */}
                          <div className="flex flex-col grow text-center items-center px-1">
                            <h3 className="text-[17px] md:text-xl font-black uppercase text-[#1F412E] mb-2 leading-tight tracking-tight">
                              {product.name}
                            </h3>

                            <p className="text-gray-600 text-[13px] md:text-sm leading-snug mb-4 font-medium line-clamp-2 md:line-clamp-3">
                              {product.shortDescription || ""}
                            </p>

                            {/* Precio (Visible en móvil debajo del texto) */}
                            <span className="text-[#1F412E] font-black text-[16px] md:text-lg mb-2 md:hidden">
                              ${product.price}
                            </span>

                            {/* BOTÓN DESKTOP CON PRECIO */}
                            <div className="hidden md:flex mt-auto w-full pt-2">
                              <button className="w-full bg-[#1F412E] text-white py-4 rounded-xl text-[13px] font-black uppercase tracking-widest hover:bg-[#e64a85] transition-colors duration-300 flex justify-center gap-2">
                                <span>Agregar al carrito</span>
                                <span className="opacity-30">|</span>
                                <span>${product.price}</span>
                              </button>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* BOTONES EXPANSIÓN */}
                  <div className="mt-16 text-center">
                    {remainingCount > 0 && !isExpanded ? (
                      <button
                        onClick={() => toggleSection(section._id)}
                        className="inline-flex items-center gap-2 px-10 py-4 border-2 border-[#e64a85] rounded-full text-[#e64a85] font-black text-[10px] uppercase tracking-widest hover:bg-[#e64a85] hover:border-[#e64a85] hover:text-white transition-all duration-300"
                      >
                        <Plus size={14} /> Ver los {remainingCount} restantes
                      </button>
                    ) : isExpanded &&
                      section.items.length > MAX_VISIBLE_ITEMS ? (
                      <button
                        onClick={() => toggleSection(section._id)}
                        className="inline-flex items-center gap-2 px-10 py-4 border-2 border-[#e64a85] rounded-full text-[#e64a85] font-black text-[10px] uppercase tracking-widest hover:bg-[#e64a85] hover:text-white transition-all duration-300"
                      >
                        <ChevronUp size={14} /> Mostrar menos
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Products;
