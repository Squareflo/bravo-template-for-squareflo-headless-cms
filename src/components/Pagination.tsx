/**
 * Pagination — SquarefloCMS Bravo Template
 * Powered by SquarefloCMS (https://squareflo.com)
 */

"use client";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pages: (number | "ellipsis")[] = [];
  const delta = 2;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }

  return (
    <nav className="pagination">
      <button
        className={`pagination__item${currentPage === 1 ? " pagination__item--disabled" : ""}`}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        type="button"
      >
        <i className="fas fa-chevron-left" />
      </button>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e${i}`} className="pagination__item pagination__item--ellipsis">
            &hellip;
          </span>
        ) : (
          <button
            key={p}
            className={`pagination__item${p === currentPage ? " pagination__item--active" : ""}`}
            onClick={() => onPageChange(p)}
            type="button"
          >
            {p}
          </button>
        )
      )}

      <button
        className={`pagination__item${currentPage === totalPages ? " pagination__item--disabled" : ""}`}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        type="button"
      >
        <i className="fas fa-chevron-right" />
      </button>
    </nav>
  );
}
