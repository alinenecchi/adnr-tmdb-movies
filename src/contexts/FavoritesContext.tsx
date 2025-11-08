import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { saveFavorites, loadFavorites } from "@/services/storage/localStorage";

// Types
interface FavoritesState {
  favorites: number[];
}

type FavoritesAction =
  | { type: "ADD_FAVORITE"; payload: number }
  | { type: "REMOVE_FAVORITE"; payload: number }
  | { type: "LOAD_FAVORITES"; payload: number[] };

interface FavoritesContextType {
  favorites: number[];
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
}

// Reducer
const favoritesReducer = (
  state: FavoritesState,
  action: FavoritesAction
): FavoritesState => {
  switch (action.type) {
    case "ADD_FAVORITE":
      if (state.favorites.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };

    case "REMOVE_FAVORITE":
      return {
        ...state,
        favorites: state.favorites.filter((id) => id !== action.payload),
      };

    case "LOAD_FAVORITES":
      return {
        ...state,
        favorites: action.payload,
      };

    default:
      return state;
  }
};

// Context
const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

// Provider
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(favoritesReducer, { favorites: [] });
  const [isInitialized, setIsInitialized] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = loadFavorites();
    dispatch({ type: "LOAD_FAVORITES", payload: stored });
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever favorites change (but not on initial load)
  useEffect(() => {
    if (isInitialized) {
      saveFavorites(state.favorites);
    }
  }, [state.favorites, isInitialized]);

  const addFavorite = (id: number) => {
    dispatch({ type: "ADD_FAVORITE", payload: id });
  };

  const removeFavorite = (id: number) => {
    dispatch({ type: "REMOVE_FAVORITE", payload: id });
  };

  const isFavorite = (id: number): boolean => {
    return state.favorites.includes(id);
  };

  const toggleFavorite = (id: number) => {
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites: state.favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// Hook
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
};
