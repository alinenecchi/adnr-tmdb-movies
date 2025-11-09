# 🎬 TMDB Movies Application

A modern React application for exploring movies using The Movie Database (TMDB) API. Built with TypeScript, Atomic Design methodology, and mobile-first responsive architecture.

## 🌐 Live Demo

**🔗 [View Live Application](https://adnr-tmdb-movies.vercel.app/)**

[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://adnr-tmdb-movies.vercel.app/)

## 📸 Preview

https://github.com/user-attachments/assets/8c23dd3a-a5ef-4645-b83c-126a32c1441a


https://github.com/user-attachments/assets/5b0c6b55-1e17-4c30-9838-4f6d3bc86c07


## 🚀 Tech Stack

### Core

- **React 18.3** - UI library with concurrent features
- **TypeScript 5.x** - Static type checking
- **Vite 5.x** - Build tool with HMR

### Routing & State

- **React Router DOM 6.x** - Client-side routing
- **Context API + useReducer** - State management
- **Custom Hooks** - Business logic encapsulation

### Styling

- **CSS Modules** - Scoped styling
- **CSS Custom Properties** - Design tokens
- **Mobile-First** - Responsive design

### Data & Quality

- **Axios** - HTTP client
- **TMDB API v3** - Movie database API
- **ESLint + Prettier** - Code quality
- **Vitest + RTL** - Testing

## 🏗️ Architecture

### Atomic Design Structure

```
src/
├── components/
│   ├── atoms/          # Basic UI elements (Button, Input, Icon)
│   ├── molecules/      # Combinations (SearchBar, MovieRating)
│   ├── organisms/      # Complex components (Header, MovieCard, MovieGrid)
│   └── templates/      # Page layouts
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── contexts/           # Global state providers
├── services/           # API and storage services
├── styles/             # Global styles and tokens
└── utils/              # Helper functions
```

### Component Hierarchy

```
Atoms → Molecules → Organisms → Templates → Pages
```

### Data Flow

```
User Action → Component → Custom Hook → API Service → TMDB API
                ↓
         State Update → Re-render
```

## 📋 Features

- Browse popular movies with infinite scroll
- Search movies with real-time results
- View detailed movie information
- Manage favorites with localStorage persistence
- Fully responsive (mobile, tablet, desktop)

## 🛠️ Setup

### Prerequisites

- Node.js ≥ 18.0.0
- npm ≥ 9.0.0
- TMDB API key ([Get one here](https://www.themoviedb.org/settings/api))

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/adnr-tmdb-movies.git
cd adnr-tmdb-movies

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your TMDB_API_KEY

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_TMDB_API_KEY=your_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
VITE_TMDB_LANGUAGE=en-US
VITE_TMDB_REGION=US
```

## 📜 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format with Prettier
npm run test             # Run tests
npm run test:coverage    # Generate coverage report
npm run type-check       # TypeScript type checking
```

## 📱 Routes

| Path              | Component    | Description                               |
| ----------------- | ------------ | ----------------------------------------- |
| `/`               | Home         | Popular movies grid with infinite scroll  |
| `/movie/:id`      | MovieDetails | Detailed movie information and actions    |
| `/favorites`      | Favorites    | User's saved favorite movies with sorting |
| `/search?q=query` | Search       | Search results with term highlighting     |

## 🔌 API Integration

### TMDB Endpoints

```typescript
// Popular Movies
GET /movie/popular

// Search Movies
GET /search/movie?query={term}

// Movie Details
GET /movie/{id}

// Images
https://image.tmdb.org/t/p/{size}/{path}
```

### API Configuration

```typescript
// src/services/api/tmdb.ts
import axios from "axios";

const tmdbClient = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL,
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: import.meta.env.VITE_TMDB_LANGUAGE,
  },
});

export default tmdbClient;
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Coverage report
npm run test:coverage
```

Tests are co-located with components following the pattern:

```
Component.tsx
Component.module.css
Component.test.tsx
```

## 📦 Build & Deploy

### Build

```bash
npm run build
# Output: dist/
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Or use the Vercel dashboard: Import your GitHub repository and configure environment variables.

### Deploy to Netlify

```bash
npm i -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

Or use the Netlify dashboard: Import your GitHub repository, set build command to `npm run build`, publish directory to `dist`, and configure environment variables.

**Note**: See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions for both platforms.

## 📐 Code Standards

### TypeScript

- Strict mode enabled
- Explicit types for props and state
- Interface over type for objects

### Components

- Functional components with hooks
- Props destructuring with defaults
- CSS Modules for styling

### Naming Conventions

- **Components**: PascalCase (`MovieCard.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useMovies.ts`)
- **Utils**: camelCase (`formatDate.ts`)
- **Styles**: Component name + `.module.css`

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add new feature
fix: bug fix
docs: documentation changes
style: code formatting
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

## 📄 License

This project is for educational and portfolio purposes.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) - Movie database API
- [Atomic Design](https://atomicdesign.bradfrost.com/) - Component methodology

---

**Note**: This product uses the TMDB API but is not endorsed or certified by TMDB.
