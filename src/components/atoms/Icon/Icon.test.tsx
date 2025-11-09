import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Icon } from "./Icon";

describe("Icon", () => {
  it("should render svg element", () => {
    const { container } = render(<Icon name="heart" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should have correct viewBox", () => {
    const { container } = render(<Icon name="star" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
  });

  it("should render all icon types without errors", () => {
    const icons: Array<
      | "heart"
      | "heart-filled"
      | "star"
      | "search"
      | "trash"
      | "film"
      | "close"
      | "arrow-left"
      | "arrow-right"
    > = [
      "heart",
      "heart-filled",
      "star",
      "search",
      "trash",
      "film",
      "close",
      "arrow-left",
      "arrow-right",
    ];

    icons.forEach((iconName) => {
      const { container } = render(<Icon name={iconName} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });
});
