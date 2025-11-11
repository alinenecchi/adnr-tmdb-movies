import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { movies, loading, error } = useFavoritedMovies(favorites);
  const [sortBy, setSortBy] = useState<SortOption>("title-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  const restoringRef = useRef<number | null>(null);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hasMovieId = params.has("movieId");
    const isRestoring = sessionStorage.getItem("isRestoringScroll") === "true";
    if (!hasMovieId && !isRestoring) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage, location.search]);

  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedMovies.slice(startIndex, endIndex);
  }, [sortedMovies, currentPage, itemsPerPage]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get("page");
    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (page !== currentPage && page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    }
  }, [location.search, currentPage, totalPages]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageParam = params.get("page");
    const movieId = params.get("movieId");

    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (page !== currentPage) {
        return;
      }
    }

    if (!movieId) return;

    const id = parseInt(movieId);
    if (restoringRef.current === id || !paginatedMovies.length || loading)
      return;

    const exists = paginatedMovies.some((m) => m.id === id);
    if (!exists) {
      const newParams = new URLSearchParams();
      if (currentPage > 1) newParams.set("page", currentPage.toString());
      const newUrl = newParams.toString()
        ? `/favorites?${newParams}`
        : "/favorites";
      navigate(newUrl, { replace: true });
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
            requestAnimationFrame(() => {
              const rect = element.getBoundingClientRect();
              const scrollY =
                window.scrollY +
                rect.top -
                window.innerHeight / 2 +
                rect.height / 2 -
                120;
              window.scrollTo({
                top: Math.max(0, scrollY),
                behavior: "smooth",
              });
              setTimeout(() => {
                const newParams = new URLSearchParams();
                if (currentPage > 1)
                  newParams.set("page", currentPage.toString());
                const newUrl = newParams.toString()
                  ? `/favorites?${newParams}`
                  : "/favorites";
                navigate(newUrl, { replace: true });
                setTimeout(() => {
                  restoringRef.current = null;
                  sessionStorage.removeItem("isRestoringScroll");
                }, 1500);
              }, 1000);
            });
          });
        });
        return true;
      }
      return false;
    };

    const tryScroll = (attempts = 0) => {
      if (scrollToMovie()) return;
      if (attempts < 100) {
        setTimeout(() => tryScroll(attempts + 1), 150);
      } else {
        const newParams = new URLSearchParams();
        if (currentPage > 1) newParams.set("page", currentPage.toString());
        const newUrl = newParams.toString()
          ? `/favorites?${newParams}`
          : "/favorites";
        navigate(newUrl, { replace: true });
        restoringRef.current = null;
        sessionStorage.removeItem("isRestoringScroll");
      }
    };

    setTimeout(() => tryScroll(), 800);
  }, [location.search, paginatedMovies, loading, navigate, currentPage]);

  const handleMovieClick = (movie: Movie) => {
    const returnUrl =
      currentPage > 1
        ? `/favorites?page=${currentPage}&movieId=${movie.id}`
        : `/favorites?movieId=${movie.id}`;
    sessionStorage.setItem("returnUrl", returnUrl);
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
