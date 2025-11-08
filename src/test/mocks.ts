import type { Movie, TMDBResponse } from "@/@types";

export const createMockMovie = (overrides: Partial<Movie> = {}): Movie => ({
  id: 1,
  title: "Mock Movie",
  original_title: "Mock Movie",
  overview: "Mock overview",
  poster_path: "/mock.jpg",
  backdrop_path: "/backdrop.jpg",
  vote_average: 8.5,
  vote_count: 100,
  release_date: "2024-01-01",
  genre_ids: [28],
  popularity: 100,
  adult: false,
  original_language: "en",
  video: false,
  ...overrides,
});

export const createMockTMDBResponse = (
  movies: Movie[],
  page = 1,
  totalPages = 1,
  totalResults?: number
): TMDBResponse<Movie> => ({
  page,
  results: movies,
  total_pages: totalPages,
  total_results: totalResults ?? movies.length * totalPages,
});
