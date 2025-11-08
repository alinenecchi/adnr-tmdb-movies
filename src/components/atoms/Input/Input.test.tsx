import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "./Input";

describe("Input", () => {
  it("should render input element", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("should handle value changes", () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test" } });

    expect(handleChange).toHaveBeenCalled();
  });

  it("should apply error state", () => {
    render(<Input error placeholder="Test" />);
    const input = screen.getByPlaceholderText("Test");
    expect(input.className).toContain("error");
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Input disabled placeholder="Test" />);
    expect(screen.getByPlaceholderText("Test")).toBeDisabled();
  });
});

