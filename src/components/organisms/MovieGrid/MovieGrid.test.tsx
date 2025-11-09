import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MovieGrid } from "./MovieGrid";
import type { Movie } from "@/@types";

const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Movie 1",
    original_title: "Movie 1",
    overview: "Overview 1",
    poster_path: "/poster1.jpg",
    backdrop_path: "/backdrop1.jpg",
    vote_average: 8.5,
    vote_count: 100,
    release_date: "2024-01-01",
    genre_ids: [28],
    popularity: 100,
    adult: false,
    original_language: "en",
    video: false,
  },
  {
    id: 2,
    title: "Movie 2",
    original_title: "Movie 2",
    overview: "Overview 2",
    poster_path: "/poster2.jpg",
    backdrop_path: "/backdrop2.jpg",
    vote_average: 7.2,
    vote_count: 50,
    release_date: "2024-02-01",
    genre_ids: [35],
    popularity: 80,
    adult: false,
    original_language: "en",
    video: false,
  },
];

describe("MovieGrid", () => {
  it("should render all movies", () => {
    render(
      <MovieGrid
        movies={mockMovies}
        isFavorite={() => false}
        onToggleFavorite={() => {}}
      />
    );

    expect(screen.getByText("Movie 1")).toBeInTheDocument();
    expect(screen.getByText("Movie 2")).toBeInTheDocument();
  });

  it("should render empty grid when no movies", () => {
    render(
      <MovieGrid
        movies={[]}
        isFavorite={() => false}
        onToggleFavorite={() => {}}
      />
    );

    expect(screen.queryByText("Movie 1")).not.toBeInTheDocument();
  });
});
