import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/organisms/Header/Header";
import { MovieGrid } from "@/components/organisms/MovieGrid/MovieGrid";
import { Loading } from "@/components/atoms/Loading/Loading";
import { EmptyState } from "@/components/organisms/EmptyState/EmptyState";
import {
  SortFilter,
  type SortOption,
} from "@/components/molecules/SortFilter/SortFilter";
import { Icon } from "@/components/atoms/Icon/Icon";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useFavoritedMovies } from "@/hooks/useFavoritedMovies";
import styles from "./Favorites.module.css";

export const Favorites = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { movies, loading, error } = useFavoritedMovies(favorites);
  const [sortBy, setSortBy] = useState<SortOption>("title-asc");

  const sortedMovies = useMemo(() => {
    const sorted = [...movies];

    switch (sortBy) {
      case "title-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case "rating-desc":
        return sorted.sort((a, b) => b.vote_average - a.vote_average);
      case "rating-asc":
        return sorted.sort((a, b) => a.vote_average - b.vote_average);
      default:
        return sorted;
    }
  }, [movies, sortBy]);

  const handleMovieClick = (id: number) => {
    navigate(`/movie/${id}`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <Loading text="Carregando favoritos..." />
        </main>
      </div>
    );
  }

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

  if (favorites.length === 0) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <EmptyState
            title="Nenhum favorito ainda"
            message="Comece explorando filmes e adicione aos favoritos para vê-los aqui!"
            actionLabel="Explorar Filmes"
            onAction={() => navigate("/")}
            icon={<Icon name="heart" size="large" />}
          />
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              Meus Favoritos ({favorites.length})
            </h1>
            <SortFilter value={sortBy} onChange={setSortBy} />
          </div>

          <MovieGrid
            movies={sortedMovies}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onMovieClick={handleMovieClick}
          />
        </div>
      </main>
    </div>
  );
};
