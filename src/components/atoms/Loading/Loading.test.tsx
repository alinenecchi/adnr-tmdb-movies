import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Loading } from "./Loading";

describe("Loading", () => {
  it("should render with default text visible", () => {
    const { container } = render(<Loading />);
    const paragraph = container.querySelector("p");
    expect(paragraph).toBeInTheDocument();
    expect(paragraph?.textContent).toBe("Loading...");
  });

  it("should render with custom text", () => {
    const { container } = render(<Loading text="Please wait..." />);
    const paragraph = container.querySelector("p");
    expect(paragraph?.textContent).toBe("Please wait...");
  });

  it("should have role status", () => {
    render(<Loading />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should apply medium size by default", () => {
    render(<Loading />);
    const spinner = screen.getByRole("status");
    expect(spinner.className).toContain("medium");
  });

  it("should apply small size", () => {
    render(<Loading size="small" />);
    const spinner = screen.getByRole("status");
    expect(spinner.className).toContain("small");
  });

  it("should apply large size", () => {
    render(<Loading size="large" />);
    const spinner = screen.getByRole("status");
    expect(spinner.className).toContain("large");
  });

  it("should not show text paragraph when showText is false", () => {
    const { container } = render(<Loading showText={false} />);
    const paragraph = container.querySelector("p");
    expect(paragraph).not.toBeInTheDocument();
  });
});
