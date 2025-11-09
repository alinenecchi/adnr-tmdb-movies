import { useState, useEffect } from "react";
import { getMovieDetails } from "@/services/api/endpoints";
import type { Movie, MovieDetails } from "@/@types";

export const useFavoritedMovies = (favoriteIds: number[]) => {
  const [movies, setMovies] = useState<
    (Movie & { genres?: MovieDetails["genres"] })[]
  >([]);
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
        // Convert MovieDetails to Movie by extracting genre_ids from genres, but keep genres for display
        const moviesData = results.map((movie) => ({
          ...movie,
          genre_ids: movie.genres.map((g) => g.id),
          genres: movie.genres, // Keep genres for display in favorites
        }));
        setMovies(moviesData);
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
