import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { MovieDetails } from "./index";
import * as endpoints from "@/services/api/endpoints";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

vi.mock("@/services/api/endpoints");

const renderWithProviders = (movieId = "1") => {
  return render(
    <MemoryRouter initialEntries={[`/movie/${movieId}`]}>
      <FavoritesProvider>
        <Routes>
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </FavoritesProvider>
    </MemoryRouter>
  );
};

describe("MovieDetails Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state initially", () => {
    vi.mocked(endpoints.getMovieDetails).mockImplementation(
      () => new Promise(() => {})
    );

    renderWithProviders();

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should render movie details after loading", async () => {
    const mockMovie = {
      id: 1,
      title: "Test Movie",
      overview: "Test overview",
      backdrop_path: "/backdrop.jpg",
      vote_average: 8.5,
      vote_count: 1000,
      release_date: "2024-01-01",
      genres: [{ id: 28, name: "Action" }],
      tagline: "Test tagline",
    };

    vi.mocked(endpoints.getMovieDetails).mockResolvedValue(mockMovie as any);

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Test Movie")).toBeInTheDocument();
    });

    expect(screen.getByText("Test overview")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("should render error state when fetch fails", async () => {
    vi.mocked(endpoints.getMovieDetails).mockRejectedValue(
      new Error("Failed to fetch")
    );

    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText("Movie not found")).toBeInTheDocument();
    });
  });
});
