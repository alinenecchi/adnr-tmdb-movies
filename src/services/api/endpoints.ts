import tmdbClient from "./tmdb";
import type { Movie, TMDBResponse } from "@/@types";

// Get popular movies
export const getPopularMovies = async (
  page: number = 1
): Promise<TMDBResponse<Movie>> => {
  const response = await tmdbClient.get<TMDBResponse<Movie>>("/movie/popular", {
    params: { page },
  });
  return response.data;
};

// Search movies
export const searchMovies = async (
  query: string,
  page: number = 1
): Promise<TMDBResponse<Movie>> => {
  const response = await tmdbClient.get<TMDBResponse<Movie>>("/search/movie", {
    params: { query, page },
  });
  return response.data;
};

// Get movie details
export const getMovieDetails = async (id: number): Promise<Movie> => {
  const response = await tmdbClient.get<Movie>(`/movie/${id}`);
  return response.data;
};

// Build image URL
export const getImageUrl = (
  path: string | null,
  size:
    | "w92"
    | "w154"
    | "w185"
    | "w300"
    | "w342"
    | "w500"
    | "w780"
    | "original" = "w500"
): string => {
  if (!path) return "/placeholder-poster.png";
  return `${import.meta.env.VITE_TMDB_IMAGE_BASE_URL}/${size}${path}`;
};
