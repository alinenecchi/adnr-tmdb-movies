import { useState, useEffect } from "react";
import { getMovieDetails } from "@/services/api/endpoints";
import type { Movie } from "@/@types";

export const useFavoritedMovies = (favoriteIds: number[]) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (favoriteIds.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const promises = favoriteIds.map((id) => getMovieDetails(id));
        const results = await Promise.all(promises);
        setMovies(results as Movie[]);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favoriteIds.join(",")]);

  return { movies, loading, error };
};
