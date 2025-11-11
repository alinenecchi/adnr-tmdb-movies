import { Image } from "@/components/atoms/Image/Image";
import { MovieRating } from "@/components/molecules/MovieRating/MovieRating";
import { FavoriteButton } from "@/components/molecules/FavoriteButton/FavoriteButton";
import { Icon } from "@/components/atoms/Icon/Icon";
import { getImageUrl } from "@/services/api/endpoints";
import { highlightText } from "@/utils/highlightText";
import type { Movie, Genre } from "@/@types";
import styles from "./MovieCard.module.css";

interface MovieCardProps {
  movie: Movie & { genres?: Genre[] };
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onClick?: (movie: Movie) => void;
  searchTerm?: string;
  showTrashIcon?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isFavorite,
  onToggleFavorite,
  onClick,
  searchTerm,
  showTrashIcon = false,
}) => {
  const imageUrl = getImageUrl(movie.poster_path, "w300");
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(movie.id);
  };

  return (
    <article
      className={styles.card}
      data-movie-id={movie.id}
      onClick={() => onClick?.(movie)}
    >
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl}
          alt={movie.title}
          className={styles.poster}
          loading="lazy"
        />
        <div className={styles.favoriteButton}>
          {showTrashIcon ? (
            <button
              type="button"
              onClick={handleFavoriteClick}
              className={styles.trashButton}
              aria-label="Remover dos favoritos"
            >
              <Icon name="trash" size="medium" />
            </button>
          ) : (
            <FavoriteButton
              isFavorite={isFavorite}
              onClick={handleFavoriteClick}
            />
          )}
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>
          {searchTerm ? highlightText(movie.title, searchTerm) : movie.title}
        </h3>

        {showTrashIcon && (
          <>
            {releaseDate && (
              <div className={styles.releaseDate}>
                Data de lançamento: {releaseDate}
              </div>
            )}
            {movie.genres && movie.genres.length > 0 && (
              <div className={styles.genres}>
                {movie.genres.map((genre) => (
                  <span key={genre.id} className={styles.genre}>
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
          </>
        )}

        <div className={styles.info}>
          <MovieRating rating={movie.vote_average} size="small" />
          <span className={styles.year}>{year}</span>
        </div>
      </div>
    </article>
  );
};
