import { ImgHTMLAttributes, useState } from "react";
import styles from "./Image.module.css";

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  fallback = "/placeholder-poster.png",
  className = "",
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImgSrc(fallback);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {isLoading && <div className={styles.placeholder} />}
      <img
        src={imgSrc}
        alt={alt}
        className={`${styles.image} ${isLoading ? styles.loading : ""}`}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </div>
  );
};

