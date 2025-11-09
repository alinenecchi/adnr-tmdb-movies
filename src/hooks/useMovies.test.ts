import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useMovies } from "./useMovies";
import * as endpoints from "@/services/api/endpoints";
import { createMockMovie, createMockTMDBResponse } from "@/test/mocks";

vi.mock("@/services/api/endpoints");

describe("useMovies", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch movies on mount", async () => {
    const mockMovie = createMockMovie({ id: 1, title: "Movie 1" });
    const mockResponse = createMockTMDBResponse([mockMovie], 1, 5);

    vi.mocked(endpoints.getPopularMovies).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.movies).toHaveLength(1);
    expect(result.current.totalPages).toBe(5);
    expect(endpoints.getPopularMovies).toHaveBeenCalledWith(1);
  });

  it("should handle errors", async () => {
    const error = new Error("API Error");
    vi.mocked(endpoints.getPopularMovies).mockRejectedValue(error);

    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.error).toEqual(error);
    });
  });

  it("should load more movies", async () => {
    const movie1 = createMockMovie({ id: 1, title: "Movie 1" });
    const movie2 = createMockMovie({ id: 2, title: "Movie 2" });
    const response1 = createMockTMDBResponse([movie1], 1, 5);
    const response2 = createMockTMDBResponse([movie2], 2, 5);

    vi.mocked(endpoints.getPopularMovies)
      .mockResolvedValueOnce(response1)
      .mockResolvedValueOnce(response2);

    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    result.current.loadMore();

    await waitFor(() => {
      expect(result.current.movies).toHaveLength(2);
    });

    expect(result.current.page).toBe(2);
  });

  it("should indicate hasMore correctly", async () => {
    const mockMovie = createMockMovie();
    const mockResponse = createMockTMDBResponse([mockMovie], 1, 5);

    vi.mocked(endpoints.getPopularMovies).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useMovies());

    await waitFor(() => {
      expect(result.current.hasMore).toBe(true);
    });
  });
});
