import { AuctionOutcome, AuctionStatus, VehicleCondition } from "@/types";

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

const statusLabels: Record<AuctionStatus, string> = {
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  LIVE: "Live",
  ENDED: "Ended",
  CANCELED: "Canceled",
};

const statusBadgeClasses: Record<AuctionStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SCHEDULED: "bg-blue-100 text-blue-700",
  LIVE: "bg-green-600 text-white",
  ENDED: "border border-green-600 text-green-700 bg-white",
  CANCELED: "bg-red-100 text-red-700",
};

const outcomeLabels: Record<AuctionOutcome, string> = {
  PENDING: "Pending",
  SOLD: "Sold",
  UNSOLD: "Unsold",
};

const outcomeBadgeClasses: Record<AuctionOutcome, string> = {
  PENDING: "bg-yellow-100 text-yellow-600",
  SOLD: "bg-green-100 text-green-800",
  UNSOLD: "bg-red-100 text-red-700",
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

export function formatAuctionOutcome(outcome: AuctionOutcome): {
  label: string;
  badgeClassName: string;
} {
  return {
    label: outcomeLabels[outcome],
    badgeClassName: outcomeBadgeClasses[outcome],
  };
}

const vehicleConditionLabels: Record<VehicleCondition, string> = {
  EXCELLENT: "Excellent",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Poor",
};

const vehicleConditionBadgeClasses: Record<VehicleCondition, string> = {
  EXCELLENT: "bg-green-100 text-green-800",
  GOOD: "bg-blue-100 text-blue-700",
  FAIR: "bg-yellow-100 text-yellow-700",
  POOR: "bg-red-100 text-red-700",
};

export function formatVehicleCondition(condition: VehicleCondition): {
  label: string;
  badgeClassName: string;
} {
  return {
    label: vehicleConditionLabels[condition],
    badgeClassName: vehicleConditionBadgeClasses[condition],
  };
}
export function toDatetimeLocalValue(date: string | Date): string {
  const value = new Date(date);
  const offset = value.getTimezoneOffset();
  const local = new Date(value.getTime() - offset * 60_000);

  return local.toISOString().slice(0, 16);
}

export function getMinDatetimeLocalValue(date: Date = new Date()): string {
  return toDatetimeLocalValue(date);
}

export function getMinEndDatetimeLocalValue(startsAt: string): string {
  const now = getMinDatetimeLocalValue();

  if (!startsAt || startsAt < now) {
    return now;
  }

  return startsAt;
}

export function getMaxDateInputValue(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
