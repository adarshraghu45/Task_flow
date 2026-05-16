import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@lib/cn';

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const AdminPagination = ({ page, totalPages, onPageChange }: AdminPaginationProps) => (
  <div className="mt-4 flex items-center justify-between">
    <p className="text-sm text-violet-300/50">
      Page {page} of {totalPages || 1}
    </p>
    <div className="flex gap-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg border border-white/10',
          page <= 1 ? 'opacity-40' : 'hover:bg-white/5',
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg border border-white/10',
          page >= totalPages ? 'opacity-40' : 'hover:bg-white/5',
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  </div>
);
