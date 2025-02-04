'use client';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn btn-secondary"
      >
        Précédent
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`btn ${
            currentPage === page ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn btn-secondary"
      >
        Suivant
      </button>
    </div>
  );
} 