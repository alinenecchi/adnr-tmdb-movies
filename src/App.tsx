import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { Showcase } from "@/pages/Showcase";
import { Home } from "@/pages/Home";

function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <Routes>
          {/* Main routes */}
          <Route path="/" element={<Home />} />

          {/* Hidden showcase route */}
          <Route path="/showcase" element={<Showcase />} />
        </Routes>
      </FavoritesProvider>
    </BrowserRouter>
  );
}

export default App;
