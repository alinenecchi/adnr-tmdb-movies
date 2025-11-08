import { useState } from "react";
import { Button } from "@/components/atoms/Button/Button";
import { Loading } from "@/components/atoms/Loading/Loading";
import { Icon } from "@/components/atoms/Icon/Icon";
import { Input } from "@/components/atoms/Input/Input";
import { Image } from "@/components/atoms/Image/Image";
import { SearchBar } from "@/components/molecules/SearchBar/SearchBar";
import { MovieRating } from "@/components/molecules/MovieRating/MovieRating";
import { FavoriteButton } from "@/components/molecules/FavoriteButton/FavoriteButton";
import styles from "./Showcase.module.css";

export const Showcase = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className={styles.showcase}>
      <h1 className={styles.title}>Components Showcase</h1>

      {/* Atoms */}
      <section className={styles.section}>
        <h2>Atoms</h2>

        <div className={styles.group}>
          <h3>Button Variants</h3>
          <div className={styles.row}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </div>

        <div className={styles.group}>
          <h3>Button Sizes</h3>
          <div className={styles.row}>
            <Button size="small">Small</Button>
            <Button size="medium">Medium</Button>
            <Button size="large">Large</Button>
          </div>
        </div>

        <div className={styles.group}>
          <h3>Loading Spinner</h3>
          <div className={styles.row}>
            <Loading size="small" text="Small" />
            <Loading size="medium" text="Medium" />
            <Loading size="large" text="Large" />
          </div>
        </div>

        <div className={styles.group}>
          <h3>Icons</h3>
          <div className={styles.row}>
            <Icon name="heart" />
            <Icon name="heart-filled" />
            <Icon name="star" />
            <Icon name="search" />
            <Icon name="trash" />
            <Icon name="film" />
            <Icon name="close" />
            <Icon name="arrow-left" />
            <Icon name="arrow-right" />
          </div>
        </div>

        <div className={styles.group}>
          <h3>Input</h3>
          <div className={styles.column}>
            <Input placeholder="Normal input" />
            <Input placeholder="Disabled input" disabled />
            <Input placeholder="Error input" error />
          </div>
        </div>

        <div className={styles.group}>
          <h3>Image with Loading & Fallback</h3>
          <div className={styles.row}>
            <div style={{ width: "200px" }}>
              <Image
                src="https://image.tmdb.org/t/p/w300/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg"
                alt="Valid image"
              />
            </div>
            <div style={{ width: "200px" }}>
              <Image src="/invalid.jpg" alt="Invalid - shows fallback" />
            </div>
          </div>
        </div>
      </section>

      {/* Molecules */}
      <section className={styles.section}>
        <h2>Molecules</h2>

        <div className={styles.group}>
          <h3>SearchBar</h3>
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            onSubmit={() => alert(`Searching for: ${searchValue}`)}
          />
        </div>

        <div className={styles.group}>
          <h3>MovieRating</h3>
          <div className={styles.row}>
            <MovieRating rating={8.5} size="small" />
            <MovieRating rating={7.2} size="medium" />
            <MovieRating rating={9.8} size="large" />
          </div>
        </div>

        <div className={styles.group}>
          <h3>FavoriteButton</h3>
          <div className={styles.row}>
            <FavoriteButton
              isFavorite={isFavorite}
              onClick={() => setIsFavorite(!isFavorite)}
            />
            <p>
              Status: {isFavorite ? "❤️ Favorited" : "🤍 Not favorited"} (click
              to toggle)
            </p>
          </div>
        </div>
      </section>

      {/* Combinations */}
      <section className={styles.section}>
        <h2>Combinations</h2>

        <div className={styles.group}>
          <h3>Button + Icon</h3>
          <div className={styles.row}>
            <Button>
              <Icon name="search" size="small" />
              Search
            </Button>
            <Button variant="secondary">
              <Icon name="trash" size="small" />
              Delete
            </Button>
            <Button variant="ghost">
              <Icon name="arrow-left" size="small" />
              Back
            </Button>
          </div>
        </div>

        <div className={styles.group}>
          <h3>Movie Card Preview</h3>
          <div className={styles.card}>
            <div className={styles.cardImage}>
              <Image
                src="https://image.tmdb.org/t/p/w300/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg"
                alt="Movie poster"
              />
              <div className={styles.cardFavorite}>
                <FavoriteButton isFavorite={true} onClick={() => {}} />
              </div>
            </div>
            <div className={styles.cardContent}>
              <h4>Movie Title Example</h4>
              <MovieRating rating={8.7} size="small" />
              <p className={styles.cardYear}>2024</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
