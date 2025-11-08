import { Button } from "@/components/atoms/Button/Button";
import { Icon } from "@/components/atoms/Icon/Icon";
import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const startItem = totalItems
    ? (currentPage - 1) * (itemsPerPage || 20) + 1
    : null;
  const endItem = totalItems
    ? Math.min(currentPage * (itemsPerPage || 20), totalItems)
    : null;

  return (
    <div className={styles.pagination}>
      {totalItems && (
        <div className={styles.info}>
          <span>
            {startItem}-{endItem} de {totalItems}
          </span>
        </div>
      )}

      <div className={styles.controls}>
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          aria-label="Página anterior"
        >
          <Icon name="arrow-left" size="small" />
          Anterior
        </Button>

        <div className={styles.pageInfo}>
          <span>
            Página {currentPage} de {totalPages}
          </span>
        </div>

        <Button
          variant="ghost"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Próxima página"
        >
          Próxima
          <Icon name="arrow-right" size="small" />
        </Button>
      </div>
    </div>
  );
};
