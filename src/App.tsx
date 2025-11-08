import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { Showcase } from "@/pages/Showcase";

function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <Routes>
          {/* Hidden route - only accessible by typing URL */}
          <Route path="/showcase" element={<Showcase />} />

          {/* Main app routes will go here */}
          <Route
            path="/"
            element={
              <div className="app">
                <h1>TMDB Movies</h1>
                <p>Main app coming soon...</p>
                <p
                  style={{
                    fontSize: "1.4rem",
                    marginTop: "2rem",
                    color: "#94a3b8",
                  }}
                >
                  🎨 To see components: <code>/showcase</code>
                </p>
              </div>
            }
          />
        </Routes>
      </FavoritesProvider>
    </BrowserRouter>
  );
}

export default App;
