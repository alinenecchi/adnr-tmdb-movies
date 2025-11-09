import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Search } from "./index";
import * as endpoints from "@/services/api/endpoints";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { createMockMovie, createMockTMDBResponse } from "@/test/mocks";

vi.mock("@/services/api/endpoints");

const renderWithProviders = (
  component: React.ReactElement,
  initialEntries = ["/"]
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <FavoritesProvider>{component}</FavoritesProvider>
    </MemoryRouter>
  );
};

describe("Search Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state initially", () => {
    vi.mocked(endpoints.searchMovies).mockImplementation(
      () => new Promise(() => {})
    );

    renderWithProviders(<Search />, ["/search?q=test"]);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should render search results", async () => {
    const mockMovie = createMockMovie({ id: 1, title: "Test Movie" });
    const mockResponse = createMockTMDBResponse([mockMovie]);

    vi.mocked(endpoints.searchMovies).mockResolvedValue(mockResponse);

    renderWithProviders(<Search />, ["/search?q=test"]);

    await waitFor(() => {
      expect(screen.getByText(/Resultados para:/)).toBeInTheDocument();
      expect(screen.getByText(/test/)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText((content, element) => {
          return (
            element?.textContent === "Test Movie" ||
            content.includes("Test Movie")
          );
        })
      ).toBeInTheDocument();
    });
  });

  it("should display total results count", async () => {
    const mockMovie = createMockMovie({ id: 1, title: "Test Movie" });
    const mockResponse = createMockTMDBResponse([mockMovie], 1, 1, 156);

    vi.mocked(endpoints.searchMovies).mockResolvedValue(mockResponse);

    renderWithProviders(<Search />, ["/search?q=test"]);

    await waitFor(() => {
      expect(screen.getByText("156 filmes encontrados")).toBeInTheDocument();
    });
  });

  it("should display singular form for one result", async () => {
    const mockMovie = createMockMovie({ id: 1, title: "Test Movie" });
    const mockResponse = createMockTMDBResponse([mockMovie], 1, 1, 1);

    vi.mocked(endpoints.searchMovies).mockResolvedValue(mockResponse);

    renderWithProviders(<Search />, ["/search?q=test"]);

    await waitFor(() => {
      expect(screen.getByText("1 filme encontrado")).toBeInTheDocument();
    });
  });

  it("should render empty state when no results", async () => {
    const mockResponse = createMockTMDBResponse([], 1, 1, 0);

    vi.mocked(endpoints.searchMovies).mockResolvedValue(mockResponse);

    renderWithProviders(<Search />, ["/search?q=test"]);

    await waitFor(() => {
      expect(screen.getByText("Nenhum filme encontrado")).toBeInTheDocument();
      expect(
        screen.getByText(/Não encontramos resultados para "test"/)
      ).toBeInTheDocument();
    });
  });

  it("should render error state when fetch fails", async () => {
    vi.mocked(endpoints.searchMovies).mockRejectedValue(
      new Error("Failed to fetch")
    );

    renderWithProviders(<Search />, ["/search?q=test"]);

    await waitFor(() => {
      expect(screen.getByText("Ops! Algo deu errado")).toBeInTheDocument();
      expect(screen.getByText("Failed to fetch")).toBeInTheDocument();
    });
  });
});
