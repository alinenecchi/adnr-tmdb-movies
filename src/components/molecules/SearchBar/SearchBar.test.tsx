import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  it("should render with placeholder", () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText("Buscar filmes...")).toBeInTheDocument();
  });

  it("should call onChange when typing", () => {
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} />);

    const input = screen.getByPlaceholderText("Buscar filmes...");
    fireEvent.change(input, { target: { value: "test" } });

    expect(handleChange).toHaveBeenCalledWith("test");
  });

  it("should call onSubmit when form is submitted", () => {
    const handleSubmit = vi.fn();
    render(<SearchBar value="test" onChange={() => {}} onSubmit={handleSubmit} />);

    const form = screen.getByRole("textbox").closest("form");
    fireEvent.submit(form!);

    expect(handleSubmit).toHaveBeenCalled();
  });

  it("should show clear button when value exists", () => {
    render(<SearchBar value="test" onChange={() => {}} />);
    expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
  });

  it("should not show clear button when value is empty", () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();
  });

  it("should clear value when clear button is clicked", () => {
    const handleChange = vi.fn();
    render(<SearchBar value="test" onChange={handleChange} />);

    const clearButton = screen.getByLabelText("Clear search");
    fireEvent.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith("");
  });
});

