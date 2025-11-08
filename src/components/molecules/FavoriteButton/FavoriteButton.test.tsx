import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FavoriteButton } from "./FavoriteButton";

describe("FavoriteButton", () => {
  it("should render with add to favorites label when not favorite", () => {
    render(<FavoriteButton isFavorite={false} onClick={() => {}} />);
    expect(screen.getByLabelText("Adicionar aos favoritos")).toBeInTheDocument();
  });

  it("should render with remove from favorites label when favorite", () => {
    render(<FavoriteButton isFavorite={true} onClick={() => {}} />);
    expect(
      screen.getByLabelText("Remover dos favoritos")
    ).toBeInTheDocument();
  });

  it("should call onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<FavoriteButton isFavorite={false} onClick={handleClick} />);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalled();
  });

  it("should apply active class when isFavorite is true", () => {
    render(<FavoriteButton isFavorite={true} onClick={() => {}} />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("active");
  });

  it("should not apply active class when isFavorite is false", () => {
    render(<FavoriteButton isFavorite={false} onClick={() => {}} />);
    const button = screen.getByRole("button");
    expect(button.className).not.toContain("active");
  });
});
