export function isInPast(date: Date, now: Date = new Date()): boolean {
  return date.getTime() < now.getTime();
}

export function isDateInFuture(date: Date, now: Date = new Date()): boolean {
  const todayUtc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  const valueUtc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );

  return valueUtc > todayUtc;
}

export function getCurrentYear(now: Date = new Date()): number {
  return now.getFullYear();
}
