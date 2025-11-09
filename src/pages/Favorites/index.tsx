import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/organisms/Header/Header";
import { MovieGrid } from "@/components/organisms/MovieGrid/MovieGrid";
import { Loading } from "@/components/atoms/Loading/Loading";
import { EmptyState } from "@/components/organisms/EmptyState/EmptyState";
import {
  SortFilter,
  type SortOption,
} from "@/components/molecules/SortFilter/SortFilter";
import { Pagination } from "@/components/molecules/Pagination/Pagination";
import { Icon } from "@/components/atoms/Icon/Icon";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useFavoritedMovies } from "@/hooks/useFavoritedMovies";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { getMovieUrl } from "@/utils/slugify";
import { PAGINATION } from "@/utils/constants";
import type { Movie } from "@/@types";
import styles from "./Favorites.module.css";

export const Favorites = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { movies, loading, error } = useFavoritedMovies(favorites);
  const [sortBy, setSortBy] = useState<SortOption>("title-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();

  const itemsPerPage = isMobile
    ? PAGINATION.ITEMS_PER_PAGE_MOBILE
    : PAGINATION.ITEMS_PER_PAGE;

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

  const totalPages = Math.ceil(sortedMovies.length / itemsPerPage);

  // Reset to page 1 when sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  // Reset to page 1 if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // Reset to page 1 when itemsPerPage changes (mobile/desktop switch)
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedMovies.slice(startIndex, endIndex);
  }, [sortedMovies, currentPage, itemsPerPage]);

  const handleMovieClick = (movie: Movie) => {
    navigate(getMovieUrl(movie.id, movie.title));
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
            <h1 className={styles.title}>Meus Filmes Favoritos</h1>
            <SortFilter value={sortBy} onChange={setSortBy} />
          </div>

          <MovieGrid
            movies={paginatedMovies}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onMovieClick={handleMovieClick}
            showTrashIcon={true}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={sortedMovies.length}
            />
          )}
        </div>
      </main>
    </div>
  );
};
