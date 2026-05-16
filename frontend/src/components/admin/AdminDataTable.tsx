import type { ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function AdminDataTable<T extends { id: string }>({
  columns,
  data,
  isLoading,
  emptyMessage = 'No data found',
}: AdminDataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-white/10 bg-[#141022]/50">
        <span className="text-sm text-violet-300/50">Loading...</span>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#141022]/50">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-3 font-medium text-violet-200/70 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-violet-300/40">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="border-b border-white/5 transition-colors hover:bg-white/5">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 text-violet-100/90 ${col.className || ''}`}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
