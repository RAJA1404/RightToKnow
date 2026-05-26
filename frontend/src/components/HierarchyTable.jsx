function SortIcon({ active, direction }) {
  return (
    <span className={`ml-2 inline-flex flex-col text-[9px] leading-[8px] ${active ? 'text-[#0F6C73]' : 'text-slate-300'}`}>
      <span>{direction === 'asc' ? '↑' : '↑'}</span>
      <span>{direction === 'desc' ? '↓' : '↓'}</span>
    </span>
  );
}

export default function HierarchyTable({
  title,
  columns,
  rows,
  searchTerm,
  onSearchChange,
  sortKey,
  sortDirection,
  onSort,
  page,
  onPageChange,
  totalRows,
  pageSize = 10,
  backButton,
  breadcrumb,
  loading = false,
  emptyMessage = 'No records found.',
}) {
  const start = totalRows === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = totalRows === 0 ? 0 : Math.min(page * pageSize, totalRows);
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

  return (
    <div className="overflow-hidden rounded-2xl border border-[#bce7df] bg-white shadow-sm transition-all duration-200">
      <div className="border-b border-slate-200 px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            {breadcrumb ? <div className="text-xs font-medium text-slate-500">{breadcrumb}</div> : null}
            <div className="flex flex-wrap items-center gap-3">
              {backButton}
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            </div>
          </div>

          <div className="w-full max-w-xs">
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#0F6C73] focus:ring-2 focus:ring-[#0F6C73]/20"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[#eaf7fb] text-left text-sm font-semibold text-slate-900">
              {columns.map((column) => (
                <th key={column.key} className={`${column.className || 'px-4 py-3'} border-b border-[#cde7ef]`}>
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => onSort(column.key)}
                      className="inline-flex items-center font-semibold text-slate-900"
                    >
                      {column.label}
                      <SortIcon active={sortKey === column.key} direction={sortDirection} />
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr
                  key={row.id || `${row.name}-${index}`}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#f4fcfc]'} border-b border-[#dceff3]`}
                >
                  {columns.map((column) => (
                    <td key={column.key} className={column.cellClassName || 'px-4 py-5 align-top text-sm text-slate-700'}>
                      {column.render ? column.render(row, index) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>
          Showing {start} to {end} of {totalRows} entries
        </p>

        {totalRows > pageSize ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-xs font-semibold text-slate-600">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="rounded border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
