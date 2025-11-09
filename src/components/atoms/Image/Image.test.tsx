import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Image } from "./Image";

describe("Image", () => {
  it("should render with src and alt", () => {
    render(<Image src="/test.jpg" alt="Test image" />);
    const img = screen.getByAltText("Test image");
    expect(img).toBeInTheDocument();
  });

  it("should use fallback on error", async () => {
    render(<Image src="/invalid.jpg" alt="Test image" />);
    const img = screen.getByAltText("Test image") as HTMLImageElement;

    fireEvent.error(img);

    await waitFor(() => {
      expect(img.src).toContain("placeholder-poster.png");
    });
  });

  it("should use custom fallback", async () => {
    render(
      <Image src="/invalid.jpg" alt="Test image" fallback="/custom-fallback.jpg" />
    );
    const img = screen.getByAltText("Test image") as HTMLImageElement;

    fireEvent.error(img);

    await waitFor(() => {
      expect(img.src).toContain("custom-fallback.jpg");
    });
  });

  it("should hide loading state after load", async () => {
    render(<Image src="/test.jpg" alt="Test image" />);
    const img = screen.getByAltText("Test image");

    fireEvent.load(img);

    await waitFor(() => {
      expect(img.className).not.toContain("loading");
    });
  });
});

