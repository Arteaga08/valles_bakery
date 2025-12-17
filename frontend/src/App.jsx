import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home"; // Importamos la Home

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white-soft">
        <Navbar />

        {/* Eliminamos el padding automático aquí para que el Hero sea Full Width */}
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Aquí irán las rutas de categorías y admin después */}
          </Routes>
        </main>

        <footer className="bg-black-bean text-white-soft py-10 px-6 text-center">
          <p className="font-fraunces text-xl mb-2 text-baby-pink">
            Valle's Bakery
          </p>
          <p className="text-sm opacity-80">
            © 2025 - Tradición en cada bocado
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
