"use client";

import type { SortDirection } from "@/lib/table-sort";

interface SortableTableHeaderProps<T extends string> {
  label: string;
  sortKey: T;
  activeSortKey: T;
  direction: SortDirection;
  onSort: (key: T) => void;
  className?: string;
}

function SortIcon({ direction }: { direction: SortDirection | null }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`h-4 w-4 shrink-0 transition-opacity ${
        direction ? "opacity-100" : "opacity-30"
      }`}
      aria-hidden="true"
    >
      {direction === "desc" ? (
        <path
          fillRule="evenodd"
          d="M10 3a.75.75 0 01.75.75v10.638l2.96-2.96a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 111.06-1.06l2.96 2.96V3.75A.75.75 0 0110 3z"
          clipRule="evenodd"
        />
      ) : (
        <path
          fillRule="evenodd"
          d="M10 17a.75.75 0 01-.75-.75V5.612L6.29 8.57a.75.75 0 01-1.06-1.06l4.25-4.25a.75.75 0 011.06 0l4.25 4.25a.75.75 0 11-1.06 1.06l-2.96-2.96V16.25A.75.75 0 0110 17z"
          clipRule="evenodd"
        />
      )}
    </svg>
  );
}

export function SortableTableHeader<T extends string>({
  label,
  sortKey,
  activeSortKey,
  direction,
  onSort,
  className = "px-4 py-3",
}: SortableTableHeaderProps<T>) {
  const isActive = activeSortKey === sortKey;
  const ariaSort = isActive
    ? direction === "asc"
      ? "ascending"
      : "descending"
    : "none";

  return (
    <th
      aria-sort={ariaSort}
      className={className}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onSort(sortKey);
        }}
        className="inline-flex items-center gap-1 font-medium text-gray-900 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {label}
        <SortIcon direction={isActive ? direction : null} />
      </button>
    </th>
  );
}
