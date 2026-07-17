export type SortDirection = "asc" | "desc";

function compareSortValues(a: unknown, b: unknown): number {
  if (a == null && b == null) {
    return 0;
  }

  if (a == null) {
    return 1;
  }

  if (b == null) {
    return -1;
  }

  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }

  if (typeof a === "string" && typeof b === "string") {
    return a.localeCompare(b);
  }

  return String(a).localeCompare(String(b));
}

export type SortOptions = {
  nullsLast?: boolean;
};

export function sortBy<T>(
  items: T[],
  getValue: (item: T) => unknown,
  direction: SortDirection,
  options: SortOptions = {},
): T[] {
  const { nullsLast = false } = options;
  const multiplier = direction === "asc" ? 1 : -1;

  return [...items].sort((a, b) => {
    const valueA = getValue(a);
    const valueB = getValue(b);

    if (nullsLast) {
      if (valueA == null && valueB == null) {
        return 0;
      }

      if (valueA == null) {
        return 1;
      }

      if (valueB == null) {
        return -1;
      }
    }

    return multiplier * compareSortValues(valueA, valueB);
  });
}

export function compareByOrder<T extends string>(
  value: T | null | undefined,
  order: readonly T[],
): number {
  if (value == null) {
    return order.length;
  }

  const index = order.indexOf(value);

  return index === -1 ? order.length : index;
}
