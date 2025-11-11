import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { Showcase } from "@/pages/Showcase";
import { Home } from "@/pages/Home";
import { MovieDetails } from "@/pages/MovieDetails";
import { Favorites } from "@/pages/Favorites";
import { Search } from "@/pages/Search";

function ScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hasMovieId = params.has("movieId");
    const isRestoring = sessionStorage.getItem("isRestoringScroll") === "true";

    if (
      !hasMovieId &&
      !location.pathname.startsWith("/movie/") &&
      !isRestoring
    ) {
      const timeoutId = setTimeout(() => {
        const stillRestoring =
          sessionStorage.getItem("isRestoringScroll") === "true";
        if (!stillRestoring) {
          window.scrollTo(0, 0);
        }
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [location.pathname, location.search]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <ScrollHandler />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/search" element={<Search />} />
          <Route path="/showcase" element={<Showcase />} />
        </Routes>
      </FavoritesProvider>
    </BrowserRouter>
  );
}

export default App;
