import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { saveFavorites, loadFavorites, clearStorage } from "./localStorage";

describe("LocalStorage Service", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("saveFavorites", () => {
    it("should save favorites to localStorage", () => {
      const favorites = [1, 2, 3];
      saveFavorites(favorites);

      const stored = localStorage.getItem("tmdb_favorites");
      expect(stored).toBe(JSON.stringify(favorites));
    });

    it("should handle empty array", () => {
      saveFavorites([]);

      const stored = localStorage.getItem("tmdb_favorites");
      expect(stored).toBe("[]");
    });

    it("should handle errors gracefully", () => {
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock setItem to throw error only for this test
      const setItemSpy = vi
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw new Error("Storage full");
        });

      saveFavorites([1, 2, 3]);

      expect(consoleError).toHaveBeenCalled();

      setItemSpy.mockRestore();
      consoleError.mockRestore();
    });
  });

  describe("loadFavorites", () => {
    it("should load favorites from localStorage", () => {
      const favorites = [1, 2, 3];
      localStorage.setItem("tmdb_favorites", JSON.stringify(favorites));

      const result = loadFavorites();
      expect(result).toEqual(favorites);
    });

    it("should return empty array if nothing stored", () => {
      const result = loadFavorites();
      expect(result).toEqual([]);
    });

    it("should handle parse errors gracefully", () => {
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      localStorage.setItem("tmdb_favorites", "invalid json");

      const result = loadFavorites();

      expect(result).toEqual([]);
      expect(consoleError).toHaveBeenCalled();

      consoleError.mockRestore();
    });
  });

  describe("clearStorage", () => {
    it("should clear all localStorage", () => {
      localStorage.setItem("tmdb_favorites", "[1,2,3]");
      localStorage.setItem("other_key", "value");

      clearStorage();

      expect(localStorage.length).toBe(0);
    });

    it("should handle errors gracefully", () => {
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock clear to throw error only for this test
      const clearSpy = vi
        .spyOn(Storage.prototype, "clear")
        .mockImplementation(() => {
          throw new Error("Clear failed");
        });

      clearStorage();

      expect(consoleError).toHaveBeenCalled();

      clearSpy.mockRestore();
      consoleError.mockRestore();
    });
  });
});
