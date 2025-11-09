import { describe, it, expect } from "vitest";
import { slugify, getMovieUrl, extractMovieId } from "./slugify";

describe("slugify", () => {
  it("should convert text to slug", () => {
    expect(slugify("The Matrix")).toBe("the-matrix");
  });

  it("should handle special characters", () => {
    expect(slugify("Spider-Man: No Way Home")).toBe("spider-man-no-way-home");
  });

  it("should handle accents", () => {
    expect(slugify("Ação e Aventura")).toBe("acao-e-aventura");
  });

  it("should handle multiple spaces", () => {
    expect(slugify("Movie   Title")).toBe("movie-title");
  });

  it("should trim leading and trailing hyphens", () => {
    expect(slugify("---Movie---")).toBe("movie");
  });
});

describe("getMovieUrl", () => {
  it("should generate URL with slug and hash", () => {
    const url = getMovieUrl(123, "The Matrix");
    expect(url).toMatch(/^\/movie\/the-matrix-[a-z0-9]+$/);
    expect(url).not.toContain("123");
  });

  it("should handle special characters in title", () => {
    const url = getMovieUrl(456, "Spider-Man: No Way Home");
    expect(url).toMatch(/^\/movie\/spider-man-no-way-home-[a-z0-9]+$/);
    expect(url).not.toContain("456");
  });
});

describe("extractMovieId", () => {
  it("should extract ID from URL with slug and hash", () => {
    expect(extractMovieId("the-matrix-3f")).toBe(123);
  });

  it("should return null for invalid format", () => {
    expect(extractMovieId("invalid")).toBe(null);
  });

  it("should extract ID from complex slug", () => {
    const url = getMovieUrl(456, "Spider-Man: No Way Home");
    const slug = url.split("/").pop() || "";
    expect(extractMovieId(slug)).toBe(456);
  });

  it("should handle URLs with multiple hyphens", () => {
    const url = getMovieUrl(789, "Star Wars: Episode IV");
    const slug = url.split("/").pop() || "";
    expect(extractMovieId(slug)).toBe(789);
  });
});
