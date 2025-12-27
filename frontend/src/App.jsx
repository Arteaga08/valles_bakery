import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Footer from "./components/Footer";

// --- IMPORTS DE ADMINISTRACIÓN ---
import AdminRoute from "./auth/AdminRoute";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import Agenda from "./pages/admin/Agenda";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductCreate from "./pages/admin/AdminProductCreate"; // Formulario Crear
import AdminProductEdit from "./pages/admin/AdminProductEdit";// Formulario Editar
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCustom from "./pages/admin/AdminCustom";

function App() {
  return (
    <Router>
      <Routes>
        {/* ===========================================================
            1. RUTAS PÚBLICAS (Cliente)
            Incluyen Navbar y Footer. El fondo es el crema de Vallée.
            =========================================================== */}
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

        {/* ===========================================================
            2. RUTAS PRIVADAS (Panel de Administración)
            Protegidas por AdminRoute. Usan AdminLayout (Sidebar).
            =========================================================== */}
        <Route element={<AdminRoute />}>
          <Route
            path="/admin/*"
            element={
              <AdminLayout>
                <Routes>
                  {/* Dashboard / Inicio Admin */}
                  <Route path="agenda" element={<Agenda />} />

                  {/* Gestión de Productos Normales */}
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

                  {/* Gestión de Productos Custom (Personalizados) */}
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
