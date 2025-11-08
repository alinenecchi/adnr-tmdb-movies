import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MovieCard } from "./MovieCard";
import type { Movie } from "@/@types";

const mockMovie: Movie = {
  id: 1,
  title: "Test Movie",
  original_title: "Test Movie",
  overview: "Test overview",
  poster_path: "/test.jpg",
  backdrop_path: "/backdrop.jpg",
  vote_average: 8.5,
  vote_count: 100,
  release_date: "2024-01-15",
  genre_ids: [28, 12],
  popularity: 100,
  adult: false,
  original_language: "en",
  video: false,
};

describe("MovieCard", () => {
  it("should render movie title", () => {
    render(
      <MovieCard
        movie={mockMovie}
        isFavorite={false}
        onToggleFavorite={() => {}}
      />
    );
    expect(screen.getByText("Test Movie")).toBeInTheDocument();
  });

  it("should render movie rating", () => {
    render(
      <MovieCard
        movie={mockMovie}
        isFavorite={false}
        onToggleFavorite={() => {}}
      />
    );
    expect(screen.getByText("8.5")).toBeInTheDocument();
  });

  it("should render release year", () => {
    render(
      <MovieCard
        movie={mockMovie}
        isFavorite={false}
        onToggleFavorite={() => {}}
      />
    );
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("should call onClick when card is clicked", () => {
    const handleClick = vi.fn();
    render(
      <MovieCard
        movie={mockMovie}
        isFavorite={false}
        onToggleFavorite={() => {}}
        onClick={handleClick}
      />
    );

    fireEvent.click(screen.getByRole("article"));
    expect(handleClick).toHaveBeenCalled();
  });

  it("should call onToggleFavorite when favorite button is clicked", () => {
    const handleToggle = vi.fn();
    render(
      <MovieCard
        movie={mockMovie}
        isFavorite={false}
        onToggleFavorite={handleToggle}
      />
    );

    fireEvent.click(screen.getByLabelText("Add to favorites"));
    expect(handleToggle).toHaveBeenCalledWith(1);
  });

  it("should not trigger card onClick when favorite button is clicked", () => {
    const handleClick = vi.fn();
    const handleToggle = vi.fn();
    render(
      <MovieCard
        movie={mockMovie}
        isFavorite={false}
        onToggleFavorite={handleToggle}
        onClick={handleClick}
      />
    );

    fireEvent.click(screen.getByLabelText("Add to favorites"));
    expect(handleToggle).toHaveBeenCalled();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should show N/A when no release date", () => {
    const movieNoDate = { ...mockMovie, release_date: "" };
    render(
      <MovieCard
        movie={movieNoDate}
        isFavorite={false}
        onToggleFavorite={() => {}}
      />
    );
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });
});
