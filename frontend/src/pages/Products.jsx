import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronUp, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../service/api";
import { useShop } from "../context/ShopContext"; // 1. Contexto Global
import { optimizeImage } from "../utils/imageOptimizer.js"; // 2. Optimizador

const Products = () => {
  const [searchParams] = useSearchParams();
  const { categories, loading: categoriesLoading } = useShop(); // Traemos categorías del contexto
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});

  const MAX_VISIBLE_ITEMS = 5;

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        setProductsLoading(true);
        // Solo cargamos productos, las categorías ya vienen del contexto
        const resP = await API.get("/products");

        let customData = [];
        try {
          const resCustom = await API.get("/custom-options/products");
          customData = resCustom.data;
        } catch (customErr) {
          console.error(
            "Los productos custom no pudieron cargarse:",
            customErr
          );
        }

        const unifiedProducts = [...resP.data, ...customData];
        setProducts(unifiedProducts);
      } catch (error) {
        console.error("Error crítico cargando productos:", error);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProductsData();
  }, []);

  useEffect(() => {
    const catId = searchParams.get("categoria");
    if (catId && !productsLoading && !categoriesLoading) {
      scrollToCategory(catId);
    }
  }, [searchParams, productsLoading, categoriesLoading]);

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

  // Unimos categorías con sus productos correspondientes
  const sections = categories
    .map((cat) => {
      const catProducts = products.filter((p) => {
        const productCatId = p.category?._id || p.category;
        return String(productCatId) === String(cat._id);
      });
      return { ...cat, items: catProducts };
    })
    .filter((section) => section.items.length > 0);

  // Estado de carga unificado
  if (productsLoading || categoriesLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#FAF7F2] text-black-bean font-black uppercase tracking-widest">
        Cargando Menú Vallée...
      </div>
    );

  return (
    <div className="bg-white-soft min-h-screen pb-20">
      {/* NAVEGACIÓN CATEGORÍAS STICKY */}
      <div className="sticky top-20 z-40 bg-[#FAF7F2]/95 backdrop-blur-md pt-4 pb-4 border-b border-black-bean/5">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar">
          <div className="flex gap-8 md:justify-center min-w-max">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => scrollToCategory(cat._id)}
                className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-black-bean hover:text-[#D97E8A] transition-colors whitespace-nowrap"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-350 mx-auto px-4 md:px-8">
        <header className="text-center mb-16 pt-10">
          <h1 className="text-5xl md:text-7xl font-serif text-black-bean mb-4">
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
                className="flex flex-col lg:flex-row gap-8 lg:gap-16 border-t border-black-bean/10 pt-16"
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
                      const mainImageUrl = product.image
                        ? product.image
                        : product.images?.find((img) => img.isMain)?.url ||
                          product.images?.[0]?.url ||
                          "";

                      const hoverImageUrl = product.image
                        ? product.image
                        : product.images?.find((img) => !img.isMain)?.url ||
                          mainImageUrl;

                      return (
                        <Link
                          key={product._id}
                          to={
                            product.shapeType
                              ? `/custom/${product._id}`
                              : `/productos/${product.slug}`
                          }
                          className="flex flex-col h-full group bg-white rounded-2xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                          {/* FOTO OPTIMIZADA */}
                          <div className="relative aspect-4/5 overflow-hidden rounded-xl mb-4 bg-gray-50">
                            <img
                              src={optimizeImage(mainImageUrl, 600)} // 600px para grid
                              alt={product.name}
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-500 group-hover:opacity-0"
                            />
                            <img
                              src={optimizeImage(hoverImageUrl, 600)}
                              alt={`${product.name} hover`}
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-cover z-0"
                            />
                          </div>

                          <div className="flex flex-col grow text-center items-center px-1">
                            <h3 className="text-[17px] md:text-xl font-black uppercase text-black-bean mb-2 leading-tight tracking-tight">
                              {product.name}
                            </h3>
                            <p className="text-black-bean/60 text-[13px] md:text-sm leading-snug mb-4 font-medium line-clamp-2">
                              {product.shortDescription || ""}
                            </p>

                            <span className="text-[#D97E8A] font-black text-[16px] md:text-lg mb-2 md:hidden">
                              ${product.price}
                            </span>

                            <div className="hidden md:flex mt-auto w-full pt-2">
                              <button className="w-full bg-black-bean text-white py-4 rounded-xl text-[13px] font-black uppercase tracking-widest hover:bg-[#D97E8A] transition-colors duration-300 flex justify-center gap-2">
                                <span>
                                  {product.shapeType
                                    ? "Personalizar"
                                    : "Agregar"}
                                </span>
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
                        className="inline-flex items-center gap-2 px-10 py-4 border-2 border-[#D97E8A] rounded-full text-[#D97E8A] font-black text-[10px] uppercase tracking-widest hover:bg-[#D97E8A] hover:text-white transition-all duration-300"
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
