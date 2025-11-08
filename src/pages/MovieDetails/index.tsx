import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/organisms/Header/Header";
import { Loading } from "@/components/atoms/Loading/Loading";
import { Button } from "@/components/atoms/Button/Button";
import { Icon } from "@/components/atoms/Icon/Icon";
import { Image } from "@/components/atoms/Image/Image";
import { MovieRating } from "@/components/molecules/MovieRating/MovieRating";
import { FavoriteButton } from "@/components/molecules/FavoriteButton/FavoriteButton";
import { useMovieDetails } from "@/hooks/useMovieDetails";
import { useFavorites } from "@/contexts/FavoritesContext";
import { getImageUrl } from "@/services/api/endpoints";
import styles from "./MovieDetails.module.css";

export const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { movie, loading, error } = useMovieDetails(Number(id));
  const { isFavorite, toggleFavorite } = useFavorites();

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <Loading text="Loading movie details..." />
        </main>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <div className={styles.error}>
            <h2>Movie not found</h2>
            <p>{error?.message || "Unable to load movie details"}</p>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
          </div>
        </main>
      </div>
    );
  }

  const backdropUrl = getImageUrl(movie.backdrop_path, "original");
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className={styles.backButton}
        >
          <Icon name="arrow-left" size="small" />
          Back
        </Button>

        <div className={styles.content}>
          <div className={styles.imageSection}>
            <Image
              src={backdropUrl}
              alt={movie.title}
              className={styles.backdrop}
            />
          </div>

          <div className={styles.infoSection}>
            <h1 className={styles.title}>{movie.title}</h1>

            {movie.tagline && <p className={styles.tagline}>{movie.tagline}</p>}

            <div className={styles.meta}>
              <MovieRating rating={movie.vote_average} size="large" />
              <span className={styles.year}>{releaseYear}</span>
              <span className={styles.voteCount}>
                {movie.vote_count.toLocaleString()} votes
              </span>
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className={styles.genres}>
                {movie.genres.map((genre) => (
                  <span key={genre.id} className={styles.genre}>
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <div className={styles.overview}>
              <h2>Synopsis</h2>
              <p>{movie.overview}</p>
            </div>

            <div className={styles.actions}>
              <Button
                variant={isFavorite(movie.id) ? "secondary" : "primary"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(movie.id);
                }}
              >
                <Icon
                  name={isFavorite(movie.id) ? "heart-filled" : "heart"}
                  size="small"
                />
                {isFavorite(movie.id)
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
