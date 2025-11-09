// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_TMDB_BASE_URL,
  API_KEY: import.meta.env.VITE_TMDB_API_KEY,
  IMAGE_BASE_URL: import.meta.env.VITE_TMDB_IMAGE_BASE_URL,
  LANGUAGE: import.meta.env.VITE_TMDB_LANGUAGE || "en-US",
  REGION: import.meta.env.VITE_TMDB_REGION || "US",
} as const;

// Image sizes
export const IMAGE_SIZES = {
  POSTER: {
    SMALL: "w92",
    MEDIUM: "w185",
    LARGE: "w342",
    XLARGE: "w500",
    ORIGINAL: "original",
  },
  BACKDROP: {
    SMALL: "w300",
    MEDIUM: "w780",
    LARGE: "w1280",
    ORIGINAL: "original",
  },
} as const;

// Routes
export const ROUTES = {
  HOME: "/",
  MOVIE_DETAILS: "/movie/:id",
  FAVORITES: "/favorites",
  SEARCH: "/search",
} as const;

// Pagination
export const PAGINATION = {
  ITEMS_PER_PAGE: 20,
  ITEMS_PER_PAGE_MOBILE: 4,
  INITIAL_PAGE: 1,
} as const;

// Debounce
export const DEBOUNCE_DELAY = 300; // ms

// Local Storage Keys
export const STORAGE_KEYS = {
  FAVORITES: "tmdb_favorites",
  THEME: "tmdb_theme",
} as const;
