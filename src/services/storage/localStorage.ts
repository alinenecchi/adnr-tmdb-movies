const STORAGE_KEYS = {
  FAVORITES: "tmdb_favorites",
} as const;

// Save favorites to localStorage
export const saveFavorites = (favorites: number[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving favorites:", error);
  }
};

// Load favorites from localStorage
export const loadFavorites = (): number[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading favorites:", error);
    return [];
  }
};

// Clear all storage
export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
};
