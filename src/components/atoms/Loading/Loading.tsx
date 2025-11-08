import styles from "./Loading.module.css";

interface LoadingProps {
  size?: "small" | "medium" | "large";
  text?: string;
  showText?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = "medium",
  text = "Loading...",
  showText = true,
}) => {
  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${styles[size]}`} role="status">
        <span className="sr-only">{text}</span>
      </div>
      {showText && <p className={styles.text}>{text}</p>}
    </div>
  );
};
