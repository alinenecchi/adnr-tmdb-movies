import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { Showcase } from "@/pages/Showcase";
import { Home } from "@/pages/Home";
import { MovieDetails } from "@/pages/MovieDetails";
import { Favorites } from "@/pages/Favorites";
import { Search } from "@/pages/Search";

function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <Routes>
          {/* Main routes */}
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/search" element={<Search />} />

          {/* Hidden showcase route */}
          <Route path="/showcase" element={<Showcase />} />
        </Routes>
      </FavoritesProvider>
    </BrowserRouter>
  );
}

export default App;
