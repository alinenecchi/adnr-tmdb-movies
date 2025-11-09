import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MovieRating } from "./MovieRating";

describe("MovieRating", () => {
  it("should render rating value", () => {
    render(<MovieRating rating={8.5} />);
    expect(screen.getByText("8.5")).toBeInTheDocument();
  });

  it("should round rating to 1 decimal", () => {
    render(<MovieRating rating={8.567} />);
    expect(screen.getByText("8.6")).toBeInTheDocument();
  });

  it("should not show value when showValue is false", () => {
    render(<MovieRating rating={8.5} showValue={false} />);
    expect(screen.queryByText("8.5")).not.toBeInTheDocument();
  });
});

