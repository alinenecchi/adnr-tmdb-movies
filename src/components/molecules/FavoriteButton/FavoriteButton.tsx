import { Icon } from "@/components/atoms/Icon/Icon";
import styles from "./FavoriteButton.module.css";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.button} ${isFavorite ? styles.active : ""} ${className}`}
      aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Icon name={isFavorite ? "heart-filled" : "heart"} size="medium" />
    </button>
  );
};
