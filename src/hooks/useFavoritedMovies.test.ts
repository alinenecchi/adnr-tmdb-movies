import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useFavoritedMovies } from "./useFavoritedMovies";
import * as endpoints from "@/services/api/endpoints";
import type { MovieDetails } from "@/@types";

vi.mock("@/services/api/endpoints");

const createMockMovieDetails = (
  id: number,
  overrides: Partial<MovieDetails> = {}
): MovieDetails => ({
  id,
  title: `Movie ${id}`,
  original_title: `Movie ${id}`,
  overview: "Overview",
  poster_path: "/poster.jpg",
  backdrop_path: "/backdrop.jpg",
  vote_average: 8.5,
  vote_count: 100,
  release_date: "2024-01-01",
  popularity: 100,
  adult: false,
  original_language: "en",
  video: false,
  genres: [{ id: 28, name: "Action" }],
  runtime: 120,
  status: "Released",
  tagline: "Tagline",
  budget: 1000000,
  revenue: 2000000,
  ...overrides,
});

describe("useFavoritedMovies", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return empty array when no favorite IDs", () => {
    const { result } = renderHook(() => useFavoritedMovies([]));

    expect(result.current.movies).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should fetch and return movies for favorite IDs", async () => {
    const mockMovie1 = createMockMovieDetails(1);
    const mockMovie2 = createMockMovieDetails(2);

    vi.spyOn(endpoints, "getMovieDetails")
      .mockResolvedValueOnce(mockMovie1)
      .mockResolvedValueOnce(mockMovie2);

    const { result } = renderHook(() => useFavoritedMovies([1, 2]));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.movies).toHaveLength(2);
    expect(result.current.movies[0].id).toBe(1);
    expect(result.current.movies[1].id).toBe(2);
    expect(result.current.movies[0].genre_ids).toEqual([28]);
    expect(result.current.error).toBe(null);
  });

  it("should handle errors when fetching fails", async () => {
    const error = new Error("Failed to fetch");
    vi.spyOn(endpoints, "getMovieDetails").mockRejectedValueOnce(error);

    const { result } = renderHook(() => useFavoritedMovies([1]));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(error);
    expect(result.current.movies).toEqual([]);
  });

  it("should convert MovieDetails to Movie with genre_ids", async () => {
    const mockMovie = createMockMovieDetails(1, {
      genres: [
        { id: 28, name: "Action" },
        { id: 12, name: "Adventure" },
      ],
    });

    vi.spyOn(endpoints, "getMovieDetails").mockResolvedValueOnce(mockMovie);

    const { result } = renderHook(() => useFavoritedMovies([1]));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.movies[0].genre_ids).toEqual([28, 12]);
    expect(result.current.movies[0]).toHaveProperty("genres");
  });

  it("should update when favorite IDs change", async () => {
    const mockMovie1 = createMockMovieDetails(1);
    const mockMovie2 = createMockMovieDetails(2);

    vi.spyOn(endpoints, "getMovieDetails")
      .mockResolvedValueOnce(mockMovie1)
      .mockResolvedValueOnce(mockMovie2);

    const { result, rerender } = renderHook(
      ({ ids }) => useFavoritedMovies(ids),
      {
        initialProps: { ids: [1] },
      }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.movies).toHaveLength(1);

    rerender({ ids: [2] });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.movies).toHaveLength(1);
    expect(result.current.movies[0].id).toBe(2);
  });
});
