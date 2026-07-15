const LOCALE = "en-GB";

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString(LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatNumber(value: number): string {
  return value.toLocaleString(LOCALE);
}
