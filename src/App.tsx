import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { Showcase } from "@/pages/Showcase";
import { Home } from "@/pages/Home";
import { MovieDetails } from "@/pages/MovieDetails";

function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <Routes>
          {/* Main routes */}
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />

          {/* Hidden showcase route */}
          <Route path="/showcase" element={<Showcase />} />
        </Routes>
      </FavoritesProvider>
    </BrowserRouter>
  );
}

export default App;
