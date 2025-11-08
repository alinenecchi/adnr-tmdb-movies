import { Button } from "@/components/atoms/Button/Button";
import { Icon } from "@/components/atoms/Icon/Icon";
import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className={styles.container}>
      {icon ? (
        <div className={styles.icon}>{icon}</div>
      ) : (
        <div className={styles.icon}>
          <Icon name="film" size="large" />
        </div>
      )}
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
};
