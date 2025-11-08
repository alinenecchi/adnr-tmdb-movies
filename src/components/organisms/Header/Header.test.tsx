import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./Header";

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Header", () => {
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
});

