import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("should render with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("should call onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>
    );

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("should apply primary variant by default", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText("Click me");
    expect(button.className).toContain("primary");
  });

  it("should apply secondary variant", () => {
    render(<Button variant="secondary">Click me</Button>);
    const button = screen.getByText("Click me");
    expect(button.className).toContain("secondary");
  });

  it("should apply ghost variant", () => {
    render(<Button variant="ghost">Click me</Button>);
    const button = screen.getByText("Click me");
    expect(button.className).toContain("ghost");
  });

  it("should apply medium size by default", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText("Click me");
    expect(button.className).toContain("medium");
  });

  it("should apply custom className", () => {
    render(<Button className="custom-class">Click me</Button>);
    const button = screen.getByText("Click me");
    expect(button.className).toContain("custom-class");
  });

  it("should render as disabled", () => {
    render(<Button disabled>Click me</Button>);
    const button = screen.getByText("Click me");
    expect(button).toBeDisabled();
  });

  it("should apply active class when active prop is true", () => {
    render(<Button active>Click me</Button>);
    const button = screen.getByText("Click me");
    expect(button.className).toContain("active");
  });

  it("should not apply active class when active prop is false", () => {
    render(<Button active={false}>Click me</Button>);
    const button = screen.getByText("Click me");
    expect(button.className).not.toContain("active");
  });
});

