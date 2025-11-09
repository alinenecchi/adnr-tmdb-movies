import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useMovieDetails } from "./useMovieDetails";
import * as endpoints from "@/services/api/endpoints";

vi.mock("@/services/api/endpoints");

describe("useMovieDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch movie details", async () => {
    const mockMovie = {
      id: 1,
      title: "Test Movie",
      overview: "Test overview",
      genres: [{ id: 28, name: "Action" }],
    };

    vi.mocked(endpoints.getMovieDetails).mockResolvedValue(mockMovie as any);

    const { result } = renderHook(() => useMovieDetails(1));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.movie).toEqual(mockMovie);
    expect(endpoints.getMovieDetails).toHaveBeenCalledWith(1);
  });

  it("should handle errors", async () => {
    const error = new Error("Failed to fetch");
    vi.mocked(endpoints.getMovieDetails).mockRejectedValue(error);

    const { result } = renderHook(() => useMovieDetails(1));

    await waitFor(() => {
      expect(result.current.error).toEqual(error);
    });
  });
});
