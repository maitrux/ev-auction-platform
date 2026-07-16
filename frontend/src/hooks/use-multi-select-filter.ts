"use client";

import { useCallback, useState } from "react";

export function useMultiSelectFilter<T extends string>() {
  const [selected, setSelected] = useState<Set<T>>(() => new Set());

  const toggle = useCallback((value: T) => {
    setSelected((current) => {
      const next = new Set(current);

      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }

      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setSelected(new Set());
  }, []);

  return {
    selected,
    toggle,
    clear,
    isActive: selected.size > 0,
  };
}
