import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
        <Navbar />

        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* 👈 2. Declarar la ruta del Menú Completo */}
            <Route path="/productos" element={<Products />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
