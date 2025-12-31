import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Footer from "./components/Footer";

//  IMPORTS DE ADMINISTRACIÓN ---
import AdminRoute from "./auth/AdminRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import Agenda from "./pages/admin/Agenda";

// GESTION DE PRODUCTOS
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductCreate from "./pages/admin/AdminProductCreate"; // Formulario Crear
import AdminProductEdit from "./pages/admin/AdminProductEdit";// Formulario Editar

import AdminCustom from "./pages/admin/AdminCustom";

// GESTION DE CATEGORIAS
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCategoryCreate from "./pages/admin/AdminCategoryCreate";
import AdminCategoryEdit from "./pages/admin/AdminCategoryEdit";

function App() {
  return (
    <Router>
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
                  <Route path="/login" element={<AdminLogin />} />
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
                  <Route path="productos/nuevo" element={<AdminProductCreate />} />
                  <Route path="productos/editar/:id" element={<AdminProductEdit />} />

                  {/* Gestión de Categorías (Rutas Actualizadas) */}
                  <Route path="categorias" element={<AdminCategories />} />
                  <Route path="categorias/nuevo" element={<AdminCategoryCreate />} />
                  <Route path="categorias/editar/:id" element={<AdminCategoryEdit />} />

                  {/* Gestión de Productos Custom */}
                  <Route path="custom" element={<AdminCustom />} />
                </Routes>
              </AdminLayout>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
