import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import CateringEvents from "./pages/CateringEvents";
import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/CartPage";
import SpecialOrders from "./pages/SpecialOrders";
import CustomCakeDetail from "./pages/CustomCakeDetail";

//  IMPORTS DE ADMINISTRACIÓN ---
import AdminRoute from "./auth/AdminRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import Agenda from "./pages/admin/Agenda";

// GESTION DE PRODUCTOS
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductCreate from "./pages/admin/AdminProductCreate"; // Formulario Crear
import AdminProductEdit from "./pages/admin/AdminProductEdit"; // Formulario Editar

// PRODUCTOS CUSTOM
import AdminCustomProducts from "./pages/admin/AdminCustom";
import AdminCustomProductCreate from "./pages/admin/AdminCustomProductCreate";
import AdminCustomBuilder from "./pages/admin/AdminCustomBuilder";

// GESTION DE CATEGORIAS
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCategoryCreate from "./pages/admin/AdminCategoryCreate";
import AdminCategoryEdit from "./pages/admin/AdminCategoryEdit";

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* 1. RUTAS PÚBLICAS */}
          <Route
            path="/*"
            element={
              <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
                <Navbar />
                <main className="grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/productos" element={<Products />} />
                    <Route
                      path="/productos/:slug"
                      element={<ProductDetail />}
                    />
                    <Route path="/custom/:id" element={<CustomCakeDetail />} />
                    <Route path="/personalizar" element={<SpecialOrders />} />
                    <Route path="/carrito" element={<CartPage />} />
                    <Route path="/login" element={<AdminLogin />} />
                    <Route
                      path="/catering-eventos"
                      element={<CateringEvents />}
                    />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />

          {/* 2. RUTAS PRIVADAS (Panel de Administración) */}
          <Route element={<AdminRoute />}>
            <Route
              path="/admin/*"
              element={
                <AdminLayout>
                  <Routes>
                    <Route path="agenda" element={<Agenda />} />

                    {/* Gestión de Productos */}
                    <Route path="productos" element={<AdminProducts />} />
                    <Route
                      path="productos/nuevo"
                      element={<AdminProductCreate />}
                    />
                    <Route
                      path="productos/editar/:id"
                      element={<AdminProductEdit />}
                    />

                    {/* Gestión de Categorías */}
                    <Route path="categorias" element={<AdminCategories />} />
                    <Route
                      path="categorias/nuevo"
                      element={<AdminCategoryCreate />}
                    />
                    <Route
                      path="categorias/editar/:id"
                      element={<AdminCategoryEdit />}
                    />

                    {/* Gestión de Productos Custom */}
                    <Route path="custom" element={<AdminCustomProducts />} />

                    {/* El formulario para CREAR (Ahora cuelga de custom/nuevo) */}
                    <Route
                      path="custom/nuevo"
                      element={<AdminCustomProductCreate />}
                    />

                    {/* El formulario para EDITAR */}
                    <Route
                      path="custom/editar/:id"
                      element={<AdminCustomProductCreate />}
                    />

                    {/* Constructor de extras */}
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
      </Router>
    </CartProvider>
  );
}

export default App;
