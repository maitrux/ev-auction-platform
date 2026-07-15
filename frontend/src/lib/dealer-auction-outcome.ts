import type { DealerAuctionOutcome } from "@/types/dealer-auction-outcome";

const outcomeLabels: Record<DealerAuctionOutcome, string> = {
  PENDING: "Pending",
  RESOLVED: "Resolved",
};

const outcomeBadgeClasses: Record<DealerAuctionOutcome, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  RESOLVED: "bg-gray-100 text-gray-700",
};

const wonBadgeClassName =
  "bg-green-100 text-green-800 ring-1 ring-green-300 font-semibold";

export function formatDealerAuctionOutcome(
  outcome: DealerAuctionOutcome,
  won: boolean,
): {
  label: string;
  badgeClassName: string;
} {
  if (outcome === "RESOLVED" && won) {
    return {
      label: "You won",
      badgeClassName: wonBadgeClassName,
    };
  }

  return {
    label: outcomeLabels[outcome],
    badgeClassName: outcomeBadgeClasses[outcome],
  };
}
