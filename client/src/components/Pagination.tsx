import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "../types/api";
import { Button } from "./Button";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ meta, onPageChange }: PaginationProps) => {
  const canGoPrevious = meta.page > 1;
  const canGoNext = meta.page < meta.totalPages;

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300 sm:flex-row">
      <span>
        Page {meta.totalPages === 0 ? 0 : meta.page} of {meta.totalPages} · {meta.total} leads
      </span>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(meta.page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="secondary"
          disabled={!canGoNext}
          onClick={() => onPageChange(meta.page + 1)}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
