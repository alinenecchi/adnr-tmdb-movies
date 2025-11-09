import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("should render title and message", () => {
    render(<EmptyState title="No results" message="Try again later" />);

    expect(screen.getByText("No results")).toBeInTheDocument();
    expect(screen.getByText("Try again later")).toBeInTheDocument();
  });

  it("should render action button when provided", () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="No results"
        message="Try again"
        actionLabel="Go Back"
        onAction={handleAction}
      />
    );

    expect(screen.getByText("Go Back")).toBeInTheDocument();
  });

  it("should call onAction when button is clicked", () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="No results"
        message="Try again"
        actionLabel="Go Back"
        onAction={handleAction}
      />
    );

    fireEvent.click(screen.getByText("Go Back"));
    expect(handleAction).toHaveBeenCalled();
  });

  it("should not render button when no action provided", () => {
    render(<EmptyState title="No results" message="Try again" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
