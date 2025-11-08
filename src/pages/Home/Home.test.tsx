import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Home } from "./index";
import * as endpoints from "@/services/api/endpoints";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { createMockMovie, createMockTMDBResponse } from "@/test/mocks";

vi.mock("@/services/api/endpoints");

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <FavoritesProvider>{component}</FavoritesProvider>
    </BrowserRouter>
  );
};

describe("Home Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render loading state initially", () => {
    vi.mocked(endpoints.getPopularMovies).mockImplementation(
      () => new Promise(() => {})
    );

    renderWithProviders(<Home />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should render movies after loading", async () => {
    const mockMovie = createMockMovie({ id: 1, title: "Test Movie" });
    const mockResponse = createMockTMDBResponse([mockMovie]);

    vi.mocked(endpoints.getPopularMovies).mockResolvedValue(mockResponse);

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Test Movie")).toBeInTheDocument();
    });
  });

  it("should render error state when fetch fails", async () => {
    vi.mocked(endpoints.getPopularMovies).mockRejectedValue(
      new Error("Failed to fetch")
    );

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(
        screen.getByText("Oops! Something went wrong")
      ).toBeInTheDocument();
      expect(screen.getByText("Failed to fetch")).toBeInTheDocument();
    });
  });

  it("should render page title", async () => {
    const mockResponse = createMockTMDBResponse([]);

    vi.mocked(endpoints.getPopularMovies).mockResolvedValue(mockResponse);

    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Popular Movies")).toBeInTheDocument();
    });
  });
});
