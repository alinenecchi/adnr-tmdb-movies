import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useSearchMovies } from "./useSearchMovies";
import * as endpoints from "@/services/api/endpoints";
import { createMockMovie, createMockTMDBResponse } from "@/test/mocks";

vi.mock("@/services/api/endpoints");

describe("useSearchMovies", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch movies on mount with query", async () => {
    const mockMovie = createMockMovie({ id: 1, title: "Test Movie" });
    const mockResponse = createMockTMDBResponse([mockMovie]);

    vi.mocked(endpoints.searchMovies).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useSearchMovies("test"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.movies).toHaveLength(1);
    expect(result.current.movies[0].title).toBe("Test Movie");
    expect(result.current.totalResults).toBe(1);
  });

  it("should not fetch if query is empty", async () => {
    const { result } = renderHook(() => useSearchMovies(""));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.movies).toHaveLength(0);
    expect(endpoints.searchMovies).not.toHaveBeenCalled();
  });

  it("should handle errors", async () => {
    const error = new Error("Failed to fetch");
    vi.mocked(endpoints.searchMovies).mockRejectedValue(error);

    const { result } = renderHook(() => useSearchMovies("test"));

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.error?.message).toBe("Failed to fetch");
  });

  it("should load more movies", async () => {
    const mockMovie1 = createMockMovie({ id: 1, title: "Movie 1" });
    const mockMovie2 = createMockMovie({ id: 2, title: "Movie 2" });
    const mockResponse1 = createMockTMDBResponse([mockMovie1], 1, 2);
    const mockResponse2 = createMockTMDBResponse([mockMovie2], 2, 2);

    vi.mocked(endpoints.searchMovies)
      .mockResolvedValueOnce(mockResponse1)
      .mockResolvedValueOnce(mockResponse2);

    const { result } = renderHook(() => useSearchMovies("test"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.movies).toHaveLength(1);
    expect(result.current.hasMore).toBe(true);

    result.current.loadMore();

    await waitFor(() => {
      expect(result.current.movies).toHaveLength(2);
    });

    expect(result.current.movies[0].title).toBe("Movie 1");
    expect(result.current.movies[1].title).toBe("Movie 2");
  });

  it("should reset movies when query changes", async () => {
    const mockMovie1 = createMockMovie({ id: 1, title: "Movie 1" });
    const mockMovie2 = createMockMovie({ id: 2, title: "Movie 2" });
    const mockResponse1 = createMockTMDBResponse([mockMovie1]);
    const mockResponse2 = createMockTMDBResponse([mockMovie2]);

    vi.mocked(endpoints.searchMovies)
      .mockResolvedValueOnce(mockResponse1)
      .mockResolvedValueOnce(mockResponse2);

    const { result, rerender } = renderHook(
      ({ query }) => useSearchMovies(query),
      {
        initialProps: { query: "test1" },
      }
    );

    await waitFor(() => {
      expect(result.current.movies).toHaveLength(1);
    });

    expect(result.current.movies[0].title).toBe("Movie 1");

    rerender({ query: "test2" });

    await waitFor(() => {
      expect(result.current.movies).toHaveLength(1);
    });

    expect(result.current.movies[0].title).toBe("Movie 2");
  });
});

