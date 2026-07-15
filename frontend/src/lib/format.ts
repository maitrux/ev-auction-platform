const LOCALE = "en-GB";

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString(LOCALE, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString(LOCALE, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatNumber(value: number): string {
  return value.toLocaleString(LOCALE);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

type AuctionStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "ACTIVE"
  | "ENDED"
  | "COMPLETED"
  | "CANCELLED";

const statusLabels: Record<AuctionStatus, string> = {
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  ACTIVE: "Active",
  ENDED: "Ended",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const statusBadgeClasses: Record<AuctionStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SCHEDULED: "bg-blue-100 text-blue-700",
  ACTIVE: "bg-green-100 text-green-700",
  ENDED: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-purple-100 text-purple-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export function formatAuctionStatus(status: AuctionStatus): {
  label: string;
  badgeClassName: string;
} {
  return {
    label: statusLabels[status],
    badgeClassName: statusBadgeClasses[status],
  };
}

export function toDatetimeLocalValue(date: string | Date): string {
  const value = new Date(date);
  const offset = value.getTimezoneOffset();
  const local = new Date(value.getTime() - offset * 60_000);

  return local.toISOString().slice(0, 16);
}
