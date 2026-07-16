"use client";

import type { SortDirection } from "@/lib/table-sort";
import { useState } from "react";

type SortState<T extends string> = {
  key: T;
  direction: SortDirection;
};

export function useTableSort<T extends string>(
  defaultKey: T,
  defaultDirection: SortDirection = "desc",
) {
  const [sort, setSort] = useState<SortState<T>>({
    key: defaultKey,
    direction: defaultDirection,
  });

  function toggleSort(key: T) {
    setSort((current) => {
      if (current.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }

      return { key, direction: "asc" };
    });
  }

  return { sortKey: sort.key, direction: sort.direction, toggleSort };
}
