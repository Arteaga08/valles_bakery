import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home"; // Importamos la Home

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-white-soft">
        <Navbar />

        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>

        <footer className="bg-black-bean text-white-soft py-10 px-6 text-center">
          <p className="font-fraunces text-2xl mb-2 text-new-york-pink">
            Vallée Cupcakes
          </p>
          <p className="text-sm opacity-60 tracking-widest uppercase">
            © 2025 - Tradición en cada bocado
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
