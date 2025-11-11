import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/organisms/Header/Header";
import { MovieGrid } from "@/components/organisms/MovieGrid/MovieGrid";
import { Loading } from "@/components/atoms/Loading/Loading";
import { useMovies } from "@/hooks/useMovies";
import { useFavorites } from "@/contexts/FavoritesContext";
import { getMovieUrl } from "@/utils/slugify";
import { useEffect, useRef } from "react";
import type { Movie } from "@/@types";
import styles from "./Home.module.css";

export const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { movies, loading, error, loadMore, hasMore } = useMovies();
  const { isFavorite, toggleFavorite } = useFavorites();
  const restoringRef = useRef<number | null>(null);

  const handleMovieClick = (movie: Movie) => {
    sessionStorage.setItem("returnUrl", `/?movieId=${movie.id}`);
    navigate(getMovieUrl(movie.id, movie.title));
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const movieId = params.get("movieId");
    if (!movieId) return;

    const id = parseInt(movieId);
    if (restoringRef.current === id || !movies.length || loading) return;

    const exists = movies.some((m) => m.id === id);
    if (!exists && !hasMore) {
      navigate("/", { replace: true });
      return;
    }

    restoringRef.current = id;
    sessionStorage.setItem("isRestoringScroll", "true");

    const scrollToMovie = () => {
      const element = document.querySelector(
        `[data-movie-id="${id}"]`
      ) as HTMLElement;
      if (element) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const rect = element.getBoundingClientRect();
            const scrollY =
              window.scrollY +
              rect.top -
              window.innerHeight / 2 +
              rect.height / 2 -
              120;
            window.scrollTo({ top: Math.max(0, scrollY), behavior: "smooth" });
            setTimeout(() => {
              navigate("/", { replace: true });
              setTimeout(() => {
                restoringRef.current = null;
                sessionStorage.removeItem("isRestoringScroll");
              }, 1500);
            }, 1000);
          });
        });
        return true;
      }
      return false;
    };

    const tryScroll = (attempts = 0) => {
      if (scrollToMovie()) return;
      if (attempts < 100) {
        if (hasMore && attempts % 5 === 0) loadMore();
        setTimeout(() => tryScroll(attempts + 1), 150);
      } else {
        navigate("/", { replace: true });
        restoringRef.current = null;
        sessionStorage.removeItem("isRestoringScroll");
      }
    };

    setTimeout(() => tryScroll(), 500);
  }, [location.search, movies, loading, hasMore, loadMore, navigate]);

  if (error) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <div className={styles.error}>
            <h2>Ops! Algo deu errado</h2>
            <p>{error.message}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>Filmes Populares</h1>

          {loading && movies.length === 0 ? (
            <Loading text="Carregando filmes..." />
          ) : (
            <MovieGrid
              movies={movies}
              loading={loading}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onMovieClick={handleMovieClick}
              onLoadMore={loadMore}
              hasMore={hasMore}
            />
          )}
        </div>
      </main>
    </div>
  );
};
