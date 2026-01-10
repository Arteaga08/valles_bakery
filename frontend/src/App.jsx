import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ShopProvider } from "./context/ShopContext";

// Componentes críticos (se cargan siempre al inicio para evitar parpadeos)
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";

// 1. CARGA PEREZOSA (LAZY LOADING) - Solo se descargan cuando se necesitan
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const CateringEvents = lazy(() => import("./pages/CateringEvents"));
const CartPage = lazy(() => import("./pages/CartPage"));
const SpecialOrders = lazy(() => import("./pages/SpecialOrders"));
const CustomCakeDetail = lazy(() => import("./pages/CustomCakeDetail"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));

// Administración (Separado por completo del paquete del cliente)
const AdminRoute = lazy(() => import("./auth/AdminRoute"));
const AdminLayout = lazy(() => import("./components/AdminLayout"));
const Agenda = lazy(() => import("./pages/admin/Agenda"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminProductCreate = lazy(() =>
  import("./pages/admin/AdminProductCreate")
);
const AdminProductEdit = lazy(() => import("./pages/admin/AdminProductEdit"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminCategoryCreate = lazy(() =>
  import("./pages/admin/AdminCategoryCreate")
);
const AdminCategoryEdit = lazy(() => import("./pages/admin/AdminCategoryEdit"));
const AdminCustomProducts = lazy(() => import("./pages/admin/AdminCustom"));
const AdminCustomProductCreate = lazy(() =>
  import("./pages/admin/AdminCustomProductCreate")
);
const AdminCustomBuilder = lazy(() =>
  import("./pages/admin/AdminCustomBuilder")
);

function App() {
  return (
    <ShopProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
            {/* El Navbar y Footer siempre visibles, sin envoltorios extra */}
            <Navbar />

            <main className="grow">
              <Suspense
                fallback={
                  <div className="h-96 flex items-center justify-center bg-[#FAF7F2]">
                    <p className="font-serif italic text-black-bean animate-pulse">
                      Cargando Vallée...
                    </p>
                  </div>
                }
              >
                <Routes>
                  {/* RUTAS PÚBLICAS */}
                  <Route path="/" element={<Home />} />
                  <Route path="/productos" element={<Products />} />
                  <Route path="/productos/:slug" element={<ProductDetail />} />
                  <Route path="/custom/:id" element={<CustomCakeDetail />} />
                  <Route path="/personalizar" element={<SpecialOrders />} />
                  <Route path="/carrito" element={<CartPage />} />
                  <Route path="/login" element={<AdminLogin />} />
                  <Route
                    path="/catering-eventos"
                    element={<CateringEvents />}
                  />

                  {/* RUTAS PRIVADAS (ADMIN) */}
                  <Route element={<AdminRoute />}>
                    <Route
                      path="/admin/*"
                      element={
                        <AdminLayout>
                          <Routes>
                            <Route path="agenda" element={<Agenda />} />
                            <Route
                              path="productos"
                              element={<AdminProducts />}
                            />
                            <Route
                              path="productos/nuevo"
                              element={<AdminProductCreate />}
                            />
                            <Route
                              path="productos/editar/:id"
                              element={<AdminProductEdit />}
                            />
                            <Route
                              path="categorias"
                              element={<AdminCategories />}
                            />
                            <Route
                              path="categorias/nuevo"
                              element={<AdminCategoryCreate />}
                            />
                            <Route
                              path="categorias/editar/:id"
                              element={<AdminCategoryEdit />}
                            />
                            <Route
                              path="custom"
                              element={<AdminCustomProducts />}
                            />
                            <Route
                              path="custom/nuevo"
                              element={<AdminCustomProductCreate />}
                            />
                            <Route
                              path="custom/editar/:id"
                              element={<AdminCustomProductCreate />}
                            />
                            <Route
                              path="custom-builder"
                              element={<AdminCustomBuilder />}
                            />
                          </Routes>
                        </AdminLayout>
                      }
                    />
                  </Route>
                </Routes>
              </Suspense>
            </main>

            <Footer />
          </div>
        </Router>
      </CartProvider>
    </ShopProvider>
  );
}

export default App;
