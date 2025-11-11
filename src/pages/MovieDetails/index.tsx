import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/organisms/Header/Header";
import { Loading } from "@/components/atoms/Loading/Loading";
import { Button } from "@/components/atoms/Button/Button";
import { Icon } from "@/components/atoms/Icon/Icon";
import { Image } from "@/components/atoms/Image/Image";
import { MovieRating } from "@/components/molecules/MovieRating/MovieRating";
import { useMovieDetails } from "@/hooks/useMovieDetails";
import { useFavorites } from "@/contexts/FavoritesContext";
import { getImageUrl } from "@/services/api/endpoints";
import { extractMovieId } from "@/utils/slugify";
import styles from "./MovieDetails.module.css";

export const MovieDetails = () => {
  const { id: idParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = idParam ? extractMovieId(idParam) : null;
  const { movie, loading, error } = useMovieDetails(movieId || 0);
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleBack = () => {
    const returnUrl = sessionStorage.getItem("returnUrl");
    if (returnUrl) {
      sessionStorage.removeItem("returnUrl");
      navigate(returnUrl);
    } else {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.main}>
          <Loading text="Carregando detalhes..." />
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
            <h2>Filme não encontrado</h2>
            <p>{error?.message || "Não foi possível carregar os detalhes"}</p>
            <Button onClick={() => navigate("/")}>Voltar ao Início</Button>
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
          onClick={handleBack}
          className={styles.backButton}
        >
          <Icon name="arrow-left" size="small" />
          Voltar
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

            {movie.genres && movie.genres.length > 0 && (
              <div className={styles.genres}>
                {movie.genres.map((genre) => (
                  <span key={genre.id} className={styles.genre}>
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {movie.tagline && <p className={styles.tagline}>{movie.tagline}</p>}

            <div className={styles.meta}>
              <MovieRating rating={movie.vote_average} size="large" />
              <span className={styles.year}>{releaseYear}</span>
              <span className={styles.voteCount}>
                {movie.vote_count.toLocaleString()} votos
              </span>
            </div>

            <div className={styles.overview}>
              <h2>Sinopse</h2>
              <p>{movie.overview}</p>
            </div>

            <div className={styles.actions}>
              <Button
                variant={isFavorite(movie.id) ? "secondary" : "primary"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(movie.id);
                }}
                className={isFavorite(movie.id) ? styles.favoriteButton : ""}
              >
                <Icon
                  name={isFavorite(movie.id) ? "heart-filled" : "heart"}
                  size="small"
                />
                {isFavorite(movie.id)
                  ? "Remover dos Favoritos"
                  : "Adicionar aos Favoritos"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
