import { FormEvent } from "react";
import { Input } from "@/components/atoms/Input/Input";
import { Icon } from "@/components/atoms/Icon/Icon";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search movies...",
}) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <Icon name="search" size="small" className={styles.icon} />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.input}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className={styles.clearButton}
          aria-label="Clear search"
        >
          <Icon name="close" size="small" />
        </button>
      )}
    </form>
  );
};

