import { MovieCard } from "@/components/organisms/MovieCard/MovieCard";
import { Loading } from "@/components/atoms/Loading/Loading";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type { Movie } from "@/@types";
import styles from "./MovieGrid.module.css";

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
  isFavorite: (id: number) => boolean;
  onToggleFavorite: (id: number) => void;
  onMovieClick?: (id: number) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  loading = false,
  isFavorite,
  onToggleFavorite,
  onMovieClick,
  onLoadMore,
  hasMore = false,
}) => {
  const loadMoreRef = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: onLoadMore || (() => {}),
  });

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isFavorite={isFavorite(movie.id)}
            onToggleFavorite={onToggleFavorite}
            onClick={() => onMovieClick?.(movie.id)}
          />
        ))}
      </div>

      {hasMore && (
        <div ref={loadMoreRef} className={styles.loadMore}>
          {loading && <Loading text="Loading more movies..." />}
        </div>
      )}
    </div>
  );
};
