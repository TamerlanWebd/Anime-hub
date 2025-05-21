// src/appp/search/components/PaginationControls.tsx
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
}) => {
  const pageNumbers = [];
  const maxPagesToShow = 5;

  if (totalPages <= maxPagesToShow + 2) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1);
    let startPage = Math.max(
      2,
      currentPage - Math.floor((maxPagesToShow - 2) / 2)
    );
    let endPage = Math.min(
      totalPages - 1,
      currentPage + Math.floor((maxPagesToShow - 2) / 2)
    );
    if (currentPage - Math.floor((maxPagesToShow - 2) / 2) < 2) {
      endPage = Math.min(totalPages - 1, 1 + (maxPagesToShow - 2));
    }
    if (currentPage + Math.floor((maxPagesToShow - 2) / 2) > totalPages - 1) {
      startPage = Math.max(2, totalPages - (maxPagesToShow - 2));
    }

    if (startPage > 2) {
      pageNumbers.push(-1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages - 1) {
      pageNumbers.push(-1);
    }

    pageNumbers.push(totalPages);
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex justify-center items-center space-x-2 my-8"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </button>

      {pageNumbers.map((page, index) =>
        page === -1 ? (
          <span
            key={`ellipsis-${index}`}
            className="p-2 text-text-muted-light dark:text-text-muted-dark"
          >
            <MoreHorizontal size={20} />
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${
                currentPage === page
                  ? "bg-brand-primary text-white shadow-md"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700 text-text-primary-light dark:text-text-primary-dark"
              }`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage || currentPage === totalPages}
        className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </button>
    </nav>
  );
};

export default PaginationControls;
