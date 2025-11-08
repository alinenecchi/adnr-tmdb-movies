import { useState, useEffect, useCallback } from "react";
import { searchMovies } from "@/services/api/endpoints";
import type { Movie } from "@/@types";

interface UseSearchMoviesReturn {
  movies: Movie[];
  loading: boolean;
  error: Error | null;
  page: number;
  totalPages: number;
  totalResults: number;
  loadMore: () => void;
  hasMore: boolean;
}

export const useSearchMovies = (query: string): UseSearchMoviesReturn => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const fetchMovies = useCallback(
    async (pageNumber: number, searchQuery: string) => {
      if (!searchQuery.trim()) {
        setMovies([]);
        setTotalPages(0);
        setTotalResults(0);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await searchMovies(searchQuery, pageNumber);

        if (pageNumber === 1) {
          setMovies(response.results);
        } else {
          setMovies((prev) => [...prev, ...response.results]);
        }

        setTotalPages(response.total_pages);
        setTotalResults(response.total_results);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    setPage(1);
    setMovies([]);
    fetchMovies(1, query);
  }, [query, fetchMovies]);

  const loadMore = useCallback(() => {
    if (!loading && page < totalPages && query.trim()) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(nextPage, query);
    }
  }, [loading, page, totalPages, query, fetchMovies]);

  const hasMore = page < totalPages;

  return {
    movies,
    loading,
    error,
    page,
    totalPages,
    totalResults,
    loadMore,
    hasMore,
  };
};

