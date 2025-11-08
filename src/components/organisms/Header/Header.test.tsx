import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./Header";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Header", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("should render logo", () => {
    renderWithRouter(<Header />);
    expect(screen.getByText("TMDB Movies")).toBeInTheDocument();
  });

  it("should render navigation buttons", () => {
    renderWithRouter(<Header />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
  });

  it("should render search bar", () => {
    renderWithRouter(<Header />);
    expect(screen.getByPlaceholderText("Search movies...")).toBeInTheDocument();
  });

  it("should navigate to search when search is submitted", () => {
    renderWithRouter(<Header />);
    
    const searchInput = screen.getByPlaceholderText("Search movies...");
    fireEvent.change(searchInput, { target: { value: "avengers" } });
    
    const form = searchInput.closest("form");
    fireEvent.submit(form!);

    expect(mockNavigate).toHaveBeenCalledWith("/search?q=avengers");
  });

  it("should not navigate when search is empty", () => {
    renderWithRouter(<Header />);
    
    const searchInput = screen.getByPlaceholderText("Search movies...");
    const form = searchInput.closest("form");
    fireEvent.submit(form!);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should navigate to home when Home button is clicked", () => {
    renderWithRouter(<Header />);
    
    fireEvent.click(screen.getByText("Home"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should navigate to favorites when Favorites button is clicked", () => {
    renderWithRouter(<Header />);
    
    fireEvent.click(screen.getByText("Favorites"));
    expect(mockNavigate).toHaveBeenCalledWith("/favorites");
  });
});
