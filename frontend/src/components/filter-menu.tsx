"use client";

import { useEffect, useRef, useState } from "react";

export interface FilterOption<T extends string> {
  value: T;
  label: string;
}

interface FilterMenuGroupProps<T extends string> {
  legend: string;
  options: FilterOption<T>[];
  selected: ReadonlySet<T>;
  onToggle: (value: T) => void;
}

interface FilterMenuProps {
  activeCount: number;
  onClearAll?: () => void;
  panelClassName?: string;
  children: React.ReactNode;
}

function FilterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
    </svg>
  );
}

export function FilterMenuGroup<T extends string>({
  legend,
  options,
  selected,
  onToggle,
}: FilterMenuGroupProps<T>) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-gray-900">{legend}</legend>
      <div className="space-y-1">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm text-gray-700 hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={selected.has(option.value)}
              onChange={() => onToggle(option.value)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function FilterMenu({
  activeCount,
  onClearAll,
  panelClassName,
  children,
}: FilterMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="true"
        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <FilterIcon />
        Filter
        {activeCount > 0 ? (
          <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
            {activeCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          className={
            panelClassName ??
            "absolute right-0 z-20 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
          }
        >
          <div className="space-y-4">{children}</div>
          {activeCount > 0 && onClearAll ? (
            <button
              type="button"
              onClick={() => {
                onClearAll();
                setOpen(false);
              }}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function NoFilterResults({ message }: { message: string }) {
  return (
    <div className="rounded-lg border bg-white p-8 text-center text-gray-600">
      {message}
    </div>
  );
}
