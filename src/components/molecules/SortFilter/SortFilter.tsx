import styles from "./SortFilter.module.css";

export type SortOption =
  | "title-asc"
  | "title-desc"
  | "rating-desc"
  | "rating-asc";

interface SortFilterProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export const SortFilter: React.FC<SortFilterProps> = ({ value, onChange }) => {
  return (
    <div className={styles.container}>
      <label htmlFor="sort-select" className={styles.label}>
        Ordenar por:
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className={styles.select}
      >
        <option value="title-asc">Título (A-Z)</option>
        <option value="title-desc">Título (Z-A)</option>
        <option value="rating-desc">Avaliação (Maior)</option>
        <option value="rating-asc">Avaliação (Menor)</option>
      </select>
    </div>
  );
};
