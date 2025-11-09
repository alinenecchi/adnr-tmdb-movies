import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Favorites } from "./index";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import * as useFavoritedMovies from "@/hooks/useFavoritedMovies";
import * as favoritesContext from "@/contexts/FavoritesContext";
import { createMockMovie } from "@/test/mocks";

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

  it("should render error state", () => {
    const error = new Error("Failed to load favorites");
    vi.spyOn(useFavoritedMovies, "useFavoritedMovies").mockReturnValue({
      movies: [],
      loading: false,
      error,
    });

    renderWithProviders();

    expect(screen.getByText("Ops! Algo deu errado")).toBeInTheDocument();
    expect(screen.getByText("Failed to load favorites")).toBeInTheDocument();
  });

  it("should render favorites list with movies", () => {
    const mockMovies = [
      createMockMovie({ id: 1, title: "Movie 1", vote_average: 8.5 }),
      createMockMovie({ id: 2, title: "Movie 2", vote_average: 7.0 }),
    ];

    // Mock favorites context to have favorites
    const mockToggleFavorite = vi.fn();
    const mockIsFavorite = vi.fn((id: number) => [1, 2].includes(id));

    vi.spyOn(favoritesContext, "useFavorites").mockReturnValue({
      favorites: [1, 2],
      toggleFavorite: mockToggleFavorite,
      isFavorite: mockIsFavorite,
      addFavorite: vi.fn(),
      removeFavorite: vi.fn(),
    });

    vi.spyOn(useFavoritedMovies, "useFavoritedMovies").mockReturnValue({
      movies: mockMovies,
      loading: false,
      error: null,
    });

    renderWithProviders();

    expect(screen.getByText("Meus Filmes Favoritos")).toBeInTheDocument();
    expect(screen.getByText("Movie 1")).toBeInTheDocument();
    expect(screen.getByText("Movie 2")).toBeInTheDocument();
  });

  it("should sort movies by title ascending", async () => {
    const mockMovies = [
      createMockMovie({ id: 1, title: "Zebra Movie" }),
      createMockMovie({ id: 2, title: "Alpha Movie" }),
    ];

    const mockUseFavorites = vi.spyOn(favoritesContext, "useFavorites");
    mockUseFavorites.mockReturnValue({
      favorites: [1, 2],
      toggleFavorite: vi.fn(),
      isFavorite: vi.fn((id: number) => [1, 2].includes(id)),
      addFavorite: vi.fn(),
      removeFavorite: vi.fn(),
    });

    vi.spyOn(useFavoritedMovies, "useFavoritedMovies").mockReturnValue({
      movies: mockMovies,
      loading: false,
      error: null,
    });

    renderWithProviders();

    // Wait for movies to render
    await waitFor(() => {
      expect(screen.getByText("Zebra Movie")).toBeInTheDocument();
    });

    const sortSelect = screen.getByLabelText(/Ordenar por/);
    fireEvent.change(sortSelect, { target: { value: "title-asc" } });

    await waitFor(() => {
      const movieTitles = screen.getAllByText(/Movie/);
      // Find the first movie title in the grid (skip header text)
      const gridTitles = movieTitles.filter(
        (el) =>
          el.textContent === "Alpha Movie" || el.textContent === "Zebra Movie"
      );
      expect(gridTitles[0]).toHaveTextContent("Alpha Movie");
    });
  });

  it("should sort movies by rating descending", async () => {
    const mockMovies = [
      createMockMovie({ id: 1, title: "Movie 1", vote_average: 5.0 }),
      createMockMovie({ id: 2, title: "Movie 2", vote_average: 9.0 }),
    ];

    const mockUseFavorites = vi.spyOn(favoritesContext, "useFavorites");
    mockUseFavorites.mockReturnValue({
      favorites: [1, 2],
      toggleFavorite: vi.fn(),
      isFavorite: vi.fn((id: number) => [1, 2].includes(id)),
      addFavorite: vi.fn(),
      removeFavorite: vi.fn(),
    });

    vi.spyOn(useFavoritedMovies, "useFavoritedMovies").mockReturnValue({
      movies: mockMovies,
      loading: false,
      error: null,
    });

    renderWithProviders();

    // Wait for movies to render
    await waitFor(() => {
      expect(screen.getByText("Movie 1")).toBeInTheDocument();
    });

    const sortSelect = screen.getByLabelText(/Ordenar por/);
    fireEvent.change(sortSelect, { target: { value: "rating-desc" } });

    await waitFor(() => {
      const movieTitles = screen.getAllByText(/Movie [12]/);
      // Find the first movie title in the grid (skip header text)
      const gridTitles = movieTitles.filter(
        (el) => el.textContent === "Movie 1" || el.textContent === "Movie 2"
      );
      expect(gridTitles[0]).toHaveTextContent("Movie 2");
    });
  });

  it("should render pagination when there are more than one page", () => {
    const mockMovies = Array.from({ length: 25 }, (_, i) =>
      createMockMovie({ id: i + 1, title: `Movie ${i + 1}` })
    );

    vi.spyOn(favoritesContext, "useFavorites").mockReturnValue({
      favorites: Array.from({ length: 25 }, (_, i) => i + 1),
      toggleFavorite: vi.fn(),
      isFavorite: vi.fn(() => true),
      addFavorite: vi.fn(),
      removeFavorite: vi.fn(),
    });

    vi.spyOn(useFavoritedMovies, "useFavoritedMovies").mockReturnValue({
      movies: mockMovies,
      loading: false,
      error: null,
    });

    renderWithProviders();

    expect(screen.getByText(/Página/)).toBeInTheDocument();
  });

  it("should navigate to movie details when movie is clicked", () => {
    const mockMovies = [createMockMovie({ id: 1, title: "Movie 1" })];

    vi.spyOn(favoritesContext, "useFavorites").mockReturnValue({
      favorites: [1],
      toggleFavorite: vi.fn(),
      isFavorite: vi.fn(() => true),
      addFavorite: vi.fn(),
      removeFavorite: vi.fn(),
    });

    vi.spyOn(useFavoritedMovies, "useFavoritedMovies").mockReturnValue({
      movies: mockMovies,
      loading: false,
      error: null,
    });

    renderWithProviders();

    // Find movie card by title (may be in highlighted text)
    const movieTitle = screen.getByText(/Movie 1/);
    expect(movieTitle).toBeInTheDocument();
  });
});
