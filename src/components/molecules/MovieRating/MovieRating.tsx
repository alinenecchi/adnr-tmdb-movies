import { Icon } from "@/components/atoms/Icon/Icon";
import styles from "./MovieRating.module.css";

interface MovieRatingProps {
  rating: number;
  size?: "small" | "medium" | "large";
  showValue?: boolean;
}

export const MovieRating: React.FC<MovieRatingProps> = ({
  rating,
  size = "medium",
  showValue = true,
}) => {
  const roundedRating = Math.round(rating * 10) / 10;

  return (
    <div className={`${styles.rating} ${styles[size]}`}>
      <Icon name="star" size={size} className={styles.icon} />
      {showValue && <span className={styles.value}>{roundedRating.toFixed(1)}</span>}
    </div>
  );
};

