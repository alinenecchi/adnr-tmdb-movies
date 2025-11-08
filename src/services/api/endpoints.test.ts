import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getPopularMovies,
  searchMovies,
  getMovieDetails,
  getImageUrl,
} from "./endpoints";
import tmdbClient from "./tmdb";

// Mock the tmdb client
vi.mock("./tmdb");

describe("API Endpoints", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPopularMovies", () => {
    it("should fetch popular movies with default page", async () => {
      const mockResponse = {
        data: {
          page: 1,
          results: [{ id: 1, title: "Test Movie" }],
          total_pages: 10,
          total_results: 200,
        },
      };

      vi.mocked(tmdbClient.get).mockResolvedValueOnce(mockResponse);

      const result = await getPopularMovies();

      expect(tmdbClient.get).toHaveBeenCalledWith("/movie/popular", {
        params: { page: 1 },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("should fetch popular movies with specific page", async () => {
      const mockResponse = {
        data: {
          page: 2,
          results: [],
          total_pages: 10,
          total_results: 200,
        },
      };

      vi.mocked(tmdbClient.get).mockResolvedValueOnce(mockResponse);

      await getPopularMovies(2);

      expect(tmdbClient.get).toHaveBeenCalledWith("/movie/popular", {
        params: { page: 2 },
      });
    });
  });

  describe("searchMovies", () => {
    it("should search movies with query", async () => {
      const mockResponse = {
        data: {
          page: 1,
          results: [{ id: 1, title: "Searched Movie" }],
          total_pages: 5,
          total_results: 100,
        },
      };

      vi.mocked(tmdbClient.get).mockResolvedValueOnce(mockResponse);

      const result = await searchMovies("test query");

      expect(tmdbClient.get).toHaveBeenCalledWith("/search/movie", {
        params: { query: "test query", page: 1 },
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe("getMovieDetails", () => {
    it("should fetch movie details by id", async () => {
      const mockMovie = {
        data: {
          id: 123,
          title: "Test Movie",
          overview: "Test overview",
        },
      };

      vi.mocked(tmdbClient.get).mockResolvedValueOnce(mockMovie);

      const result = await getMovieDetails(123);

      expect(tmdbClient.get).toHaveBeenCalledWith("/movie/123");
      expect(result).toEqual(mockMovie.data);
    });
  });

  describe("getImageUrl", () => {
    it("should return placeholder for null path", () => {
      const result = getImageUrl(null);
      expect(result).toBe("/placeholder-poster.png");
    });

    it("should build correct image URL with default size", () => {
      const result = getImageUrl("/test.jpg");
      expect(result).toContain("w500");
      expect(result).toContain("/test.jpg");
    });

    it("should build correct image URL with specific size", () => {
      const result = getImageUrl("/test.jpg", "w300");
      expect(result).toContain("w300");
      expect(result).toContain("/test.jpg");
    });
  });
});
