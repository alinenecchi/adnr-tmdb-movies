import { useState, useEffect } from "react";
import { getMovieDetails } from "@/services/api/endpoints";
import type { MovieDetails } from "@/@types";

interface UseMovieDetailsReturn {
  movie: MovieDetails | null;
  loading: boolean;
  error: Error | null;
}

export const useMovieDetails = (id: number): UseMovieDetailsReturn => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  return { movie, loading, error };
};
