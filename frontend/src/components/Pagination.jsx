export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="mt-8 flex items-center justify-center gap-1">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="rounded-md border border-line px-3 py-1.5 text-sm font-medium disabled:opacity-40"
      >
        Prev
      </button>

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const showEllipsis = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1">
            {showEllipsis && <span className="px-1 text-ink/40">…</span>}
            <button
              type="button"
              onClick={() => onChange(p)}
              className={`h-8 w-8 rounded-md text-sm font-medium ${
                p === page ? "bg-forest text-paper" : "border border-line hover:bg-line/40"
              }`}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded-md border border-line px-3 py-1.5 text-sm font-medium disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
