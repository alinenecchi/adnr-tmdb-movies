import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { Button } from "@/components/atoms/Button/Button";
import { Icon } from "@/components/atoms/Icon/Icon";
import styles from "./Header.module.css";

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/search") {
      const params = new URLSearchParams(location.search);
      const query = params.get("q") || "";
      setSearchQuery(query);
    } else {
      setSearchQuery("");
    }
  }, [location]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // If clearing search while on search page, navigate to home
    if (!value.trim() && location.pathname === "/search") {
      navigate("/");
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <Icon name="film" size="large" />
          <h1 className={styles.logoText}>TMDB Movies</h1>
        </Link>

        <div className={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            onSubmit={handleSearch}
          />
        </div>

        <nav className={styles.nav}>
          <Button
            variant="ghost"
            active={location.pathname === "/"}
            onClick={() => navigate("/")}
          >
            Início
          </Button>
          <Button
            variant="ghost"
            active={location.pathname === "/favorites"}
            onClick={() => navigate("/favorites")}
          >
            <Icon name="heart" size="small" />
            Favoritos
          </Button>
        </nav>
      </div>
    </header>
  );
};
