import type { AuctionOutcome, AuctionStatus } from "@/types/auction";
import type { DealerAuctionOutcome } from "@/types/dealer-auction-outcome";

export type AdminOutcomeFilter = AuctionOutcome | "NONE";

export function matchesStatusFilter(
  status: AuctionStatus,
  selected: ReadonlySet<AuctionStatus>,
): boolean {
  return selected.size === 0 || selected.has(status);
}

export function matchesAdminOutcomeFilter(
  outcome: AuctionOutcome | null,
  selected: ReadonlySet<AdminOutcomeFilter>,
): boolean {
  if (selected.size === 0) {
    return true;
  }

  if (outcome === null) {
    return selected.has("NONE");
  }

  return selected.has(outcome);
}

export function matchesDealerOutcomeFilter(
  outcome: DealerAuctionOutcome | null,
  selected: ReadonlySet<DealerAuctionOutcome>,
): boolean {
  if (selected.size === 0) {
    return true;
  }

  if (outcome === null) {
    return false;
  }

  return selected.has(outcome);
}
