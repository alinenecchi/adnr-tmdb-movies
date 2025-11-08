import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/organisms/Header/Header";
import { MovieGrid } from "@/components/organisms/MovieGrid/MovieGrid";
import { Loading } from "@/components/atoms/Loading/Loading";
import { EmptyState } from "@/components/organisms/EmptyState/EmptyState";
import { Icon } from "@/components/atoms/Icon/Icon";
import { useSearchMovies } from "@/hooks/useSearchMovies";
import { useFavorites } from "@/contexts/FavoritesContext";
import { getMovieUrl } from "@/utils/slugify";
import type { Movie } from "@/@types";
import styles from "./Search.module.css";

export const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const { movies, loading, error, totalResults, loadMore, hasMore } =
    useSearchMovies(query);
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleMovieClick = (movie: Movie) => {
    navigate(getMovieUrl(movie.id, movie.title));
  };

  useEffect(() => {
    if (!query.trim()) {
      navigate("/");
    }
  }, [query, navigate]);

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

  if (!query.trim()) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              Resultados para: &quot;{query}&quot;
            </h1>
            {totalResults > 0 && (
              <p className={styles.count}>
                {totalResults}{" "}
                {totalResults === 1 ? "filme encontrado" : "filmes encontrados"}
              </p>
            )}
          </div>

          {loading && movies.length === 0 ? (
            <Loading text="Buscando filmes..." />
          ) : movies.length === 0 ? (
            <EmptyState
              title="Nenhum filme encontrado"
              message={`Não encontramos resultados para "${query}". Tente buscar com outros termos.`}
              actionLabel="Voltar para Início"
              onAction={() => navigate("/")}
              icon={<Icon name="search" size="large" />}
            />
          ) : (
            <MovieGrid
              movies={movies}
              loading={loading}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onMovieClick={handleMovieClick}
              onLoadMore={loadMore}
              hasMore={hasMore}
              searchTerm={query}
            />
          )}
        </div>
      </main>
    </div>
  );
};
