"use client";

type DataTablePaginationProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRows: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

const PAGE_SIZE_OPTIONS = [10, 20, 30];

export function DataTablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalRows,
  itemLabel,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps) {
  const firstVisibleRow =
    totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const lastVisibleRow = Math.min(
    currentPage * pageSize,
    totalRows,
  );

  return (
    <footer className="flex flex-col gap-3 border-t border-border px-6 py-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
      <span>
        {totalRows === 0
          ? "No hay registros para mostrar"
          : `Mostrando ${firstVisibleRow}-${lastVisibleRow} de ${totalRows} ${itemLabel}`}
      </span>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <label
          htmlFor={`${itemLabel}-page-size`}
          className="whitespace-nowrap"
        >
          Filas por página:
        </label>

        <select
          id={`${itemLabel}-page-size`}
          value={pageSize}
          onChange={(event) =>
            onPageSizeChange(Number(event.target.value))
          }
          className="rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-foreground outline-none focus:border-primary"
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="rounded-lg border border-border px-3 py-1.5 text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          Anterior
        </button>

        <span className="whitespace-nowrap text-foreground">
          Página {currentPage} de {totalPages}
        </span>

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() =>
            onPageChange(Math.min(totalPages, currentPage + 1))
          }
          className="rounded-lg border border-border px-3 py-1.5 text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </footer>
  );
}