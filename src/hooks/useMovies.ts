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

const CACHE_KEY = "home_movies_cache";
const PAGE_KEY = "home_movies_page";
const TOTAL_PAGES_KEY = "home_movies_total_pages";

export const useMovies = (): UseMoviesReturn => {
  const getCached = () => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  };

  const getCachedPage = () => {
    try {
      const cached = sessionStorage.getItem(PAGE_KEY);
      return cached ? parseInt(cached, 10) : 1;
    } catch {
      return 1;
    }
  };

  const getCachedTotalPages = () => {
    try {
      const cached = sessionStorage.getItem(TOTAL_PAGES_KEY);
      return cached ? parseInt(cached, 10) : 0;
    } catch {
      return 0;
    }
  };

  const [movies, setMovies] = useState<Movie[]>(getCached);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(getCachedPage);
  const [totalPages, setTotalPages] = useState(getCachedTotalPages);

  const fetchMovies = useCallback(async (pageNumber: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPopularMovies(pageNumber);

      if (pageNumber === 1) {
        setMovies(response.results);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(response.results));
      } else {
        setMovies((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newMovies = response.results.filter(
            (m) => !existingIds.has(m.id)
          );
          const updated = [...prev, ...newMovies];
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(updated));
          return updated;
        });
      }

      setTotalPages(response.total_pages);
      sessionStorage.setItem(PAGE_KEY, pageNumber.toString());
      sessionStorage.setItem(TOTAL_PAGES_KEY, response.total_pages.toString());
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (movies.length === 0) {
      fetchMovies(1);
    }
  }, [fetchMovies, movies.length]);

  const loadMore = useCallback(() => {
    if (!loading && page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      sessionStorage.setItem(PAGE_KEY, nextPage.toString());
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
