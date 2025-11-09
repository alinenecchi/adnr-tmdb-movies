import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SortFilter } from "./SortFilter";

describe("SortFilter", () => {
  it("should render with default value", () => {
    render(<SortFilter value="title-asc" onChange={() => {}} />);

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("title-asc");
  });

  it("should call onChange when value changes", () => {
    const handleChange = vi.fn();
    render(<SortFilter value="title-asc" onChange={handleChange} />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "rating-desc" } });

    expect(handleChange).toHaveBeenCalledWith("rating-desc");
  });

  it("should have all sort options", () => {
    render(<SortFilter value="title-asc" onChange={() => {}} />);

    expect(screen.getByText("Título (A-Z)")).toBeInTheDocument();
    expect(screen.getByText("Título (Z-A)")).toBeInTheDocument();
    expect(screen.getByText("Avaliação (Maior)")).toBeInTheDocument();
    expect(screen.getByText("Avaliação (Menor)")).toBeInTheDocument();
  });
});
