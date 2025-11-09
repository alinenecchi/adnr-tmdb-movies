import { useState, useEffect, useCallback } from "react";
import { getPopularMovies } from "@/services/api/endpoints";
import type { Movie } from "@/@types";

interface UseMoviesReturn {
  movies: Movie[];
  loading: boolean;
  error: Error | null;
  page: number;
  totalPages: number;
  loadMore: () => void;
  hasMore: boolean;
}

export const useMovies = (): UseMoviesReturn => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchMovies = useCallback(async (pageNumber: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPopularMovies(pageNumber);

      if (pageNumber === 1) {
        setMovies(response.results);
      } else {
        setMovies((prev) => [...prev, ...response.results]);
      }

      setTotalPages(response.total_pages);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies(1);
  }, [fetchMovies]);

  const loadMore = useCallback(() => {
    if (!loading && page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(nextPage);
    }
  }, [loading, page, totalPages, fetchMovies]);

  const hasMore = page < totalPages;

  return {
    movies,
    loading,
    error,
    page,
    totalPages,
    loadMore,
    hasMore,
  };
};
