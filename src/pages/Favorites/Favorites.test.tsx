import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Favorites } from "./index";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import * as useFavoritedMovies from "@/hooks/useFavoritedMovies";

vi.mock("@/hooks/useFavoritedMovies");

const renderWithProviders = () => {
  return render(
    <MemoryRouter>
      <FavoritesProvider>
        <Favorites />
      </FavoritesProvider>
    </MemoryRouter>
  );
};

describe("Favorites Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render empty state when no favorites", () => {
    vi.spyOn(useFavoritedMovies, "useFavoritedMovies").mockReturnValue({
      movies: [],
      loading: false,
      error: null,
    });

    renderWithProviders();

    expect(screen.getByText("Nenhum favorito ainda")).toBeInTheDocument();
    expect(screen.getByText("Explorar Filmes")).toBeInTheDocument();
  });

  it("should render loading state", () => {
    vi.spyOn(useFavoritedMovies, "useFavoritedMovies").mockReturnValue({
      movies: [],
      loading: true,
      error: null,
    });

    renderWithProviders();

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
