import { useNavigate } from "react-router-dom";
import { Header } from "@/components/organisms/Header/Header";
import { MovieGrid } from "@/components/organisms/MovieGrid/MovieGrid";
import { Loading } from "@/components/atoms/Loading/Loading";
import { useMovies } from "@/hooks/useMovies";
import { useFavorites } from "@/contexts/FavoritesContext";
import styles from "./Home.module.css";

export const Home = () => {
  const navigate = useNavigate();
  const { movies, loading, error, loadMore, hasMore } = useMovies();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleMovieClick = (id: number) => {
    navigate(`/movie/${id}`);
  };

  if (error) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <div className={styles.error}>
            <h2>Oops! Something went wrong</h2>
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
          <h1 className={styles.title}>Popular Movies</h1>

          {loading && movies.length === 0 ? (
            <Loading text="Loading movies..." />
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
