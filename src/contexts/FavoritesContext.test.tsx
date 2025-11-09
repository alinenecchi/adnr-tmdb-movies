import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { FavoritesProvider, useFavorites } from "./FavoritesContext";
import * as localStorage from "@/services/storage/localStorage";

// Mock localStorage service
vi.mock("@/services/storage/localStorage");

describe("FavoritesContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(localStorage.loadFavorites).mockReturnValue([]);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <FavoritesProvider>{children}</FavoritesProvider>
  );

  it("should load favorites on mount", () => {
    vi.mocked(localStorage.loadFavorites).mockReturnValue([1, 2, 3]);

    const { result } = renderHook(() => useFavorites(), { wrapper });

    expect(result.current.favorites).toEqual([1, 2, 3]);
    expect(localStorage.loadFavorites).toHaveBeenCalled();
  });

  it("should add favorite", () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    act(() => {
      result.current.addFavorite(1);
    });

    expect(result.current.favorites).toContain(1);
    expect(localStorage.saveFavorites).toHaveBeenCalledWith([1]);
  });

  it("should not add duplicate favorite", () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    act(() => {
      result.current.addFavorite(1);
      result.current.addFavorite(1);
    });

    expect(result.current.favorites).toEqual([1]);
  });

  it("should remove favorite", () => {
    vi.mocked(localStorage.loadFavorites).mockReturnValue([1, 2, 3]);

    const { result } = renderHook(() => useFavorites(), { wrapper });

    act(() => {
      result.current.removeFavorite(2);
    });

    expect(result.current.favorites).toEqual([1, 3]);
    expect(localStorage.saveFavorites).toHaveBeenCalledWith([1, 3]);
  });

  it("should check if movie is favorite", () => {
    vi.mocked(localStorage.loadFavorites).mockReturnValue([1, 2, 3]);

    const { result } = renderHook(() => useFavorites(), { wrapper });

    expect(result.current.isFavorite(1)).toBe(true);
    expect(result.current.isFavorite(2)).toBe(true);
    expect(result.current.isFavorite(99)).toBe(false);
  });

  it("should toggle favorite on", () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    act(() => {
      result.current.toggleFavorite(1);
    });

    expect(result.current.favorites).toContain(1);
  });

  it("should toggle favorite off", () => {
    vi.mocked(localStorage.loadFavorites).mockReturnValue([1]);

    const { result } = renderHook(() => useFavorites(), { wrapper });

    act(() => {
      result.current.toggleFavorite(1);
    });

    expect(result.current.favorites).not.toContain(1);
  });
});
