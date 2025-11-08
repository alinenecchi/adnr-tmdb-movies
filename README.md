# 🎬 TMDB Movies Application

A modern React application for exploring movies, managing personalized favorites lists, and discovering new content through The Movie Database (TMDB) API.

## 📋 Table of Contents

- [Technology Stack](#-technology-stack)
- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Development Roadmap](#-development-roadmap)
- [Installation & Setup](#-installation--setup)
- [Core Features](#-core-features)
- [Code Standards](#-code-standards)
- [Testing Strategy](#-testing-strategy)
- [Performance Optimization](#-performance-optimization)
- [Deployment](#-deployment)

## 🚀 Technology Stack

### Core Technologies

- **React 18.3.x** - UI library with concurrent features
- **TypeScript 5.x** - Static type checking and enhanced IDE support
- **Vite 5.x** - Next-generation frontend tooling with HMR

### State Management & Routing

- **React Router DOM 6.x** - Declarative routing with data loading APIs
- **Context API + useReducer** - Predictable state management
- **Custom Hooks** - Reusable stateful logic encapsulation

### Styling Architecture

- **CSS Modules** - Locally scoped CSS with zero runtime overhead
- **CSS Custom Properties** - Design token system for theming
- **Mobile-First Responsive Design** - Progressive enhancement approach

### HTTP Client & API Integration

- **Axios 1.6.x** - Promise-based HTTP client with interceptors
- **TMDB API v3** - RESTful movie database endpoints

### Code Quality & Testing

- **ESLint 8.x** - Static code analysis with TypeScript rules
- **Prettier 3.x** - Opinionated code formatter
- **Vitest** - Vite-native unit test framework
- **React Testing Library** - Component testing utilities
- **Husky** - Git hooks for pre-commit/pre-push automation

### Deployment Platforms

- **Vercel** / **Netlify** - Zero-config deployment with CDN

## 🏗️ Architecture Overview

### Design Principles

1. **Separation of Concerns**: Clear boundaries between presentation, business logic, and data layers
2. **Component Composition**: Atomic design methodology with reusable components
3. **Mobile-First Progressive Enhancement**: Base styles for mobile, enhanced for larger viewports
4. **Type Safety First**: Comprehensive TypeScript coverage across the codebase
5. **Feature-Based Organization**: Domain-driven folder structure

### Architectural Patterns

- **Atomic Design**: Component hierarchy from atoms to pages
- **Container/Presenter Pattern**: Separation of stateful logic from presentation
- **Custom Hook Pattern**: Encapsulation of reusable component logic
- **Provider Pattern**: Global state distribution via React Context
- **Error Boundary Pattern**: Component-level error isolation and recovery

### Atomic Design Component Hierarchy

```
Atoms (Basic Building Blocks)
  ├─ Button, Input, Icon, Image, Label, Loading, Badge
  └─ Single-purpose, reusable, no dependencies on other components
      ↓
Molecules (Simple Combinations)
  ├─ SearchBar, MovieRating, FavoriteButton, GenreList, Pagination
  └─ Combination of atoms, single responsibility
      ↓
Organisms (Complex Compositions)
  ├─ Header, MovieCard, MovieGrid, MovieDetails, Footer
  └─ Complex components, composed of molecules and atoms
      ↓
Templates (Page Layouts)
  ├─ MainLayout, GridLayout, DetailsLayout
  └─ Page structure without data
      ↓
Pages (Complete Views)
  ├─ Home, MovieDetails, Favorites, Search
  └─ Templates populated with actual data
```

### Data Flow Architecture

```
User Interaction
      ↓
Component Event Handler
      ↓
Custom Hook (useMovies, useFavorites)
      ↓
API Service Layer (Axios)
      ↓
HTTP Request to TMDB API
      ↓
Response Processing & Transformation
      ↓
State Update (useState/useReducer)
      ↓
React Re-render with New Data
      ↓
UI Update
```

## 📁 Project Structure

```
adnr-tmdb-movies/
├── public/
│   ├── favicon.ico
│   └── assets/
├── src/
│   ├── @types/                        # Global TypeScript declarations
│   │   └── index.d.ts
│   ├── assets/                        # Static assets (images, icons)
│   │   ├── icons/
│   │   └── images/
│   ├── components/                    # React components (Atomic Design)
│   │   ├── atoms/                     # Basic building blocks
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.module.css
│   │   │   │   └── Button.test.tsx
│   │   │   ├── Icon/
│   │   │   ├── Image/
│   │   │   ├── Input/
│   │   │   ├── Label/
│   │   │   ├── Loading/
│   │   │   └── Badge/
│   │   ├── molecules/                 # Simple component combinations
│   │   │   ├── SearchBar/
│   │   │   ├── MovieRating/
│   │   │   ├── FavoriteButton/
│   │   │   ├── GenreList/
│   │   │   ├── Pagination/
│   │   │   └── SortFilter/
│   │   ├── organisms/                 # Complex component compositions
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── MovieCard/
│   │   │   ├── MovieGrid/
│   │   │   ├── MovieDetails/
│   │   │   ├── EmptyState/
│   │   │   └── ErrorBoundary/
│   │   └── templates/                 # Page-level layouts
│   │       ├── MainLayout/
│   │       ├── GridLayout/
│   │       └── DetailsLayout/
│   ├── contexts/                      # React Context providers
│   │   ├── FavoritesContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/                         # Custom React hooks
│   │   ├── useMovies.ts
│   │   ├── useFavorites.ts
│   │   ├── useDebounce.ts
│   │   └── useInfiniteScroll.ts
│   ├── pages/                         # Route-level page components
│   │   ├── Home/
│   │   ├── MovieDetails/
│   │   ├── Favorites/
│   │   └── Search/
│   ├── services/                      # External service integrations
│   │   ├── api/
│   │   │   ├── tmdb.ts               # TMDB API client
│   │   │   └── endpoints.ts          # API endpoint definitions
│   │   └── storage/
│   │       └── localStorage.ts       # Browser storage abstraction
│   ├── styles/                        # Global styles and design tokens
│   │   ├── tokens/
│   │   │   ├── colors.css
│   │   │   ├── spacing.css
│   │   │   ├── typography.css
│   │   │   └── breakpoints.css
│   │   ├── mixins/
│   │   │   ├── responsive.css
│   │   │   └── layout.css
│   │   ├── global.css
│   │   └── index.css
│   ├── utils/                         # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── routes.tsx
│   └── vite-env.d.ts
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 📅 Development Roadmap

### Phase 1: Project Setup & Configuration (3 commits)

- **Commit 1**: `docs: add technical documentation and architecture specifications`
- **Commit 2**: `chore: initialize Vite project with React 18 and TypeScript 5`
- **Commit 3**: `chore: configure ESLint, Prettier, and Git hooks`

### Phase 2: Styling System Implementation (3 commits)

- **Commit 4**: `style: implement design token system with CSS custom properties`
- **Commit 5**: `style: configure CSS Modules with global styles and reset`
- **Commit 6**: `style: create responsive mixin utilities and grid system`

### Phase 3: API Integration & State Management (3 commits)

- **Commit 7**: `feat: configure Axios client and TMDB API service layer`
- **Commit 8**: `feat: implement FavoritesContext with useReducer pattern`
- **Commit 9**: `feat: create localStorage service for state persistence`

### Phase 4: Base Component Library (6 commits)

- **Commit 10**: `feat: create Button component with variants and accessibility`
- **Commit 11**: `feat: implement Loading component with spinner animation`
- **Commit 12**: `feat: build Header component with integrated SearchBar`
- **Commit 13**: `feat: create MovieCard component with favorite functionality`
- **Commit 14**: `feat: implement MovieGrid with responsive layout`
- **Commit 15**: `feat: add ErrorBoundary for component error handling`

### Phase 5: Home Page Implementation (4 commits)

- **Commit 16**: `feat: scaffold Home page structure and layout`
- **Commit 17**: `feat: implement useMovies hook for popular movies fetching`
- **Commit 18**: `feat: add Pagination component to Home page`
- **Commit 19**: `feat: implement infinite scroll with Intersection Observer`

### Phase 6: Movie Details Page (4 commits)

- **Commit 20**: `feat: create MovieDetails page responsive layout`
- **Commit 21**: `feat: implement useMovieDetails hook for data fetching`
- **Commit 22**: `feat: integrate favorite/unfavorite functionality`
- **Commit 23**: `style: optimize MovieDetails responsive breakpoints`

### Phase 7: Favorites Management (4 commits)

- **Commit 24**: `feat: scaffold Favorites page structure`
- **Commit 25**: `feat: render favorites list with context integration`
- **Commit 26**: `feat: implement sorting and filtering capabilities`
- **Commit 27**: `feat: create EmptyState component with call-to-action`

### Phase 8: Search Functionality (4 commits)

- **Commit 28**: `feat: create Search page with query parameter handling`
- **Commit 29**: `feat: implement useSearch hook with API integration`
- **Commit 30**: `feat: add search term highlighting in results`
- **Commit 31**: `feat: implement useDebounce hook for search optimization`

### Phase 9: Testing Suite (5 commits)

- **Commit 32**: `test: add comprehensive tests for Button component`
- **Commit 33**: `test: implement MovieCard component test suite`
- **Commit 34**: `test: add FavoritesContext integration tests`
- **Commit 35**: `test: create Home page integration tests`
- **Commit 36**: `test: add custom hooks unit tests`

### Phase 10: Production Optimization (4 commits)

- **Commit 37**: `fix: enhance error handling and user feedback`
- **Commit 38**: `perf: optimize re-renders with React.memo and useMemo`
- **Commit 39**: `docs: update documentation with deployment instructions`
- **Commit 40**: `ci: configure deployment pipeline and environment`

## 🛠️ Installation & Setup

### Prerequisites

- Node.js ≥ 18.0.0
- npm ≥ 9.0.0 or yarn ≥ 1.22.0
- TMDB API account (free tier)

### Setup Instructions

1. **Clone repository**

```bash
git clone https://github.com/your-username/adnr-tmdb-movies.git
cd adnr-tmdb-movies
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` file with your TMDB API credentials:

```env
VITE_TMDB_API_KEY=your_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
VITE_TMDB_LANGUAGE=en-US
VITE_TMDB_REGION=US
```

4. **Start development server**

```bash
npm run dev
```

5. **Access application**

```
http://localhost:5173
```

### Available Scripts

```bash
npm run dev          # Start development server with HMR
npm run build        # Build production bundle
npm run preview      # Preview production build locally
npm run lint         # Run ESLint static analysis
npm run lint:fix     # Fix auto-fixable ESLint issues
npm run format       # Format code with Prettier
npm run test         # Run test suite
npm run test:ui      # Run tests with UI interface
npm run test:coverage # Generate coverage report
npm run type-check   # Run TypeScript type checking
```

## ✨ Core Features

### Home Page (`/`)

- Responsive grid displaying popular movies from TMDB
- Infinite scroll or pagination for browsing content
- Movie cards featuring:
  - Poster image (300px width from TMDB)
  - TMDB rating visualization
  - Favorite toggle button (persistent state)
- Fixed header with global search functionality

### Movie Details Page (`/movie/:id`)

- Two-column responsive layout:
  - Left: High-resolution backdrop image
  - Right: Movie information
- Displayed information:
  - Title and original title
  - Genre tags
  - Release date
  - User rating and vote count
  - Synopsis/overview
  - Favorite toggle with state synchronization

### Favorites Page (`/favorites`)

- Grid layout consistent with Home page
- Persistent favorites managed via Context API
- Sorting capabilities:
  - Alphabetical (A-Z / Z-A)
  - Rating (high to low / low to high)
- Remove from favorites functionality
- Empty state component when no favorites exist

### Search Page (`/search?q=query`)

- Activated via global header search bar
- Query parameter synchronization with search input
- Results displayed in responsive grid
- Visual highlighting of search term in movie titles
- Infinite scroll or pagination for results

## 📐 Code Standards

### TypeScript Conventions

```typescript
// Interface naming with descriptive prefixes
export interface MovieCardProps {
  movie: Movie;
  onFavorite: (id: number) => void;
  isFavorite: boolean;
}

// Type for API responses
export type TMDBResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

// Enum for action types
export enum FavoritesActionType {
  ADD_FAVORITE = "ADD_FAVORITE",
  REMOVE_FAVORITE = "REMOVE_FAVORITE",
  LOAD_FAVORITES = "LOAD_FAVORITES",
}
```

### Component Structure

```typescript
// Functional component with TypeScript
interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  disabled = false,
  onClick,
  children,
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};
```

### CSS Modules Naming

```css
/* MovieCard.module.css */
/* Block */
.card {
  display: flex;
  flex-direction: column;
}

/* Element */
.card__image {
  width: 100%;
  aspect-ratio: 2/3;
}

/* Modifier */
.card--featured {
  border: 2px solid var(--color-primary);
}

/* State */
.card.is-loading {
  opacity: 0.6;
  pointer-events: none;
}
```

### Mobile-First Responsive Design

```css
/* Base styles - Mobile (< 600px) */
.container {
  padding: var(--spacing-md);
  grid-template-columns: 1fr;
}

/* Tablet (≥ 600px) */
@media (min-width: 600px) {
  .container {
    padding: var(--spacing-lg);
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop (≥ 1080px) */
@media (min-width: 1080px) {
  .container {
    padding: var(--spacing-xl);
    grid-template-columns: repeat(4, 1fr);
  }
}
```

## 🧪 Testing Strategy

### Test Pyramid

```
    /\
   /  \    E2E Tests (few)
  /────\   - Critical user flows
 /      \
/────────\ Integration Tests (some)
          - Page-level testing
          - Context integration
──────────────────────────────────
          Unit Tests (many)
          - Components
          - Hooks
          - Utilities
```

### Testing Utilities

```typescript
// Component testing example
import { render, screen, fireEvent } from "@testing-library/react";
import { MovieCard } from "./MovieCard";

describe("MovieCard", () => {
  const mockMovie = {
    id: 1,
    title: "Test Movie",
    poster_path: "/test.jpg",
    vote_average: 8.5,
  };

  it("renders movie information correctly", () => {
    render(<MovieCard movie={mockMovie} />);

    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      expect.stringContaining("/test.jpg")
    );
  });

  it("calls onFavorite when favorite button is clicked", () => {
    const handleFavorite = jest.fn();
    render(<MovieCard movie={mockMovie} onFavorite={handleFavorite} />);

    fireEvent.click(screen.getByRole("button", { name: /favorite/i }));
    expect(handleFavorite).toHaveBeenCalledWith(1);
  });
});
```

## ⚡ Performance Optimization

### Implemented Optimizations

1. **Code Splitting**: Dynamic imports for route-based code splitting
2. **Lazy Loading**: Progressive image loading with `loading="lazy"`
3. **Memoization**: Strategic use of `React.memo`, `useMemo`, `useCallback`
4. **Debouncing**: 300ms debounce on search input to reduce API calls
5. **Infinite Scroll**: Load data on-demand rather than all at once
6. **Image Optimization**: Leverage TMDB's responsive image sizes
7. **Tree Shaking**: Automatic dead code elimination via Vite

### Performance Metrics Targets

- **FCP** (First Contentful Paint): < 1.8s
- **LCP** (Largest Contentful Paint): < 2.5s
- **TTI** (Time to Interactive): < 3.8s
- **CLS** (Cumulative Layout Shift): < 0.1
- **FID** (First Input Delay): < 100ms

### Bundle Size Targets

- Initial bundle (gzipped): < 200KB
- Each lazy-loaded route: < 50KB
- Total JavaScript: < 500KB

## 🚀 Deployment

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Features:
# - Zero configuration
# - Automatic HTTPS
# - Global CDN
# - Environment variable management
# - Git integration with preview deployments
```

### Netlify Deployment

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist

# Features:
# - Continuous deployment
# - Deploy previews for pull requests
# - Form handling
# - Serverless functions
```

### Environment Variables Configuration

Ensure the following environment variables are configured in your deployment platform:

```
VITE_TMDB_API_KEY=your_production_api_key
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
VITE_TMDB_LANGUAGE=en-US
VITE_TMDB_REGION=US
```

## 📊 Design System

### Color Palette

```css
:root {
  /* Primary Colors */
  --color-primary: #e50914;
  --color-primary-dark: #b20710;
  --color-primary-light: #f6121d;

  /* Neutral Colors */
  --color-background: #141414;
  --color-surface: #1f1f1f;
  --color-text: #ffffff;
  --color-text-secondary: #b3b3b3;

  /* State Colors */
  --color-success: #46d369;
  --color-error: #e50914;
  --color-warning: #f0ad4e;
}
```

### Spacing System (8px base)

```css
:root {
  --spacing-xs: 0.4rem; /* 4px */
  --spacing-sm: 0.8rem; /* 8px */
  --spacing-md: 1.6rem; /* 16px */
  --spacing-lg: 2.4rem; /* 24px */
  --spacing-xl: 3.2rem; /* 32px */
  --spacing-xxl: 4.8rem; /* 48px */
}
```

### Typography Scale

```css
:root {
  --text-size-xs: 1.2rem; /* 12px */
  --text-size-sm: 1.4rem; /* 14px */
  --text-size-base: 1.6rem; /* 16px */
  --text-size-lg: 2rem; /* 20px */
  --text-size-xl: 2.4rem; /* 24px */
  --text-size-2xl: 3.2rem; /* 32px */

  --text-weight-normal: 400;
  --text-weight-medium: 500;
  --text-weight-bold: 700;
}
```

### Responsive Breakpoints

```css
:root {
  --breakpoint-mobile: 600px;
  --breakpoint-tablet: 1080px;
  --breakpoint-desktop: 1920px;
}
```

## 📚 API Documentation

### TMDB API Integration

**Base URL**: `https://api.themoviedb.org/3`

**Authentication**: API Key via query parameter

### Primary Endpoints

```typescript
// Get popular movies
GET /movie/popular?api_key={key}&language={lang}&page={page}

// Search movies
GET /search/movie?api_key={key}&language={lang}&query={query}&page={page}

// Get movie details
GET /movie/{movie_id}?api_key={key}&language={lang}

// Image URLs
https://image.tmdb.org/t/p/{size}/{file_path}
// Available sizes: w92, w154, w185, w342, w500, w780, original
```

## 📄 License

This project is developed for educational and portfolio purposes.

## 👨‍💻 Author

Developed by Aline

---

**TMDB Attribution**: This product uses the TMDB API but is not endorsed or certified by TMDB.
