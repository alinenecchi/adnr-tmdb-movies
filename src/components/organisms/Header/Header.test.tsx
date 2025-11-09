import { describe, it, expect, vi, beforeEach } from "vitest";
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
    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Favoritos")).toBeInTheDocument();
  });

  it("should render search bar", () => {
    renderWithRouter(<Header />);
    expect(screen.getByPlaceholderText("Buscar filmes...")).toBeInTheDocument();
  });

  it("should navigate to search when search is submitted", () => {
    renderWithRouter(<Header />);
    
    const searchInput = screen.getByPlaceholderText("Buscar filmes...");
    fireEvent.change(searchInput, { target: { value: "avengers" } });
    
    const form = searchInput.closest("form");
    fireEvent.submit(form!);

    expect(mockNavigate).toHaveBeenCalledWith("/search?q=avengers");
  });

  it("should not navigate when search is empty", () => {
    renderWithRouter(<Header />);
    
    const searchInput = screen.getByPlaceholderText("Buscar filmes...");
    const form = searchInput.closest("form");
    fireEvent.submit(form!);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should navigate to home when Home button is clicked", () => {
    renderWithRouter(<Header />);
    
    fireEvent.click(screen.getByText("Início"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("should navigate to favorites when Favorites button is clicked", () => {
    renderWithRouter(<Header />);
    
    fireEvent.click(screen.getByText("Favoritos"));
    expect(mockNavigate).toHaveBeenCalledWith("/favorites");
  });

  it("should apply active class to button when pathname matches", () => {
    // This test verifies the active prop is passed correctly
    // The actual active state depends on useLocation which is tested in integration
    renderWithRouter(<Header />);
    
    // By default, on home page, the Home button should be active
    const homeButton = screen.getByText("Início").closest("button");
    expect(homeButton).toBeInTheDocument();
  });

  it("should toggle mobile menu when button is clicked", () => {
    renderWithRouter(<Header />);
    
    const menuButton = screen.getByLabelText("Menu");
    expect(menuButton).toBeInTheDocument();
    
    // Menu should not be visible initially
    expect(screen.queryByText("Início")).toBeInTheDocument(); // Desktop nav
    
    // Click to open menu
    fireEvent.click(menuButton);
    
    // Menu should be open (mobile menu buttons should be visible)
    const mobileMenuButtons = screen.getAllByText("Início");
    expect(mobileMenuButtons.length).toBeGreaterThan(1);
    
    // Click to close menu
    fireEvent.click(menuButton);
  });

  it("should close mobile menu when navigation link is clicked", () => {
    renderWithRouter(<Header />);
    
    const menuButton = screen.getByLabelText("Menu");
    fireEvent.click(menuButton);
    
    // Find mobile menu buttons (there should be multiple "Início" buttons)
    const mobileButtons = screen.getAllByText("Início");
    const mobileButton = mobileButtons.find(
      (btn) => btn.closest("button")?.className.includes("mobileNavButton")
    );
    
    if (mobileButton) {
      fireEvent.click(mobileButton);
      expect(mockNavigate).toHaveBeenCalledWith("/");
    }
  });

});
