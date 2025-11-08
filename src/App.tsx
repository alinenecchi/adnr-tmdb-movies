import { BrowserRouter } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <div className="app">
          <h1>TMDB Movies</h1>
          <p>Ready for development!</p>
          <p style={{ fontSize: "1.4rem", marginTop: "1rem" }}>
            Run: <code>npm run test</code> to verify services
          </p>
        </div>
      </FavoritesProvider>
    </BrowserRouter>
  );
}

export default App;
