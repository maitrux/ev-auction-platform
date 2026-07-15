import type { AuctionBid, AuctionOutcome } from "@/types";

export function getHighestBid(bids: AuctionBid[]): AuctionBid | null {
  if (bids.length === 0) {
    return null;
  }

  return bids.reduce((highest, bid) => {
    if (bid.amount > highest.amount) {
      return bid;
    }

    if (
      bid.amount === highest.amount &&
      new Date(bid.createdAt) < new Date(highest.createdAt)
    ) {
      return bid;
    }

    return highest;
  });
}

export function getAcceptOutcomeError(
  reservePrice: number | null,
  bids: AuctionBid[],
): string | null {
  if (reservePrice == null) {
    return "Reserve price is required to accept a bid";
  }

  const highestBid = getHighestBid(bids);

  if (!highestBid) {
    return "Cannot accept an auction with no bids";
  }

  if (highestBid.amount < reservePrice) {
    return "Highest bid must meet or exceed the reserve price";
  }

  return null;
}

export function formatAuctionOutcome(outcome: AuctionOutcome): string {
  switch (outcome) {
    case "PENDING":
      return "Pending review";
    case "SOLD":
      return "Sold";
    case "UNSOLD":
      return "Unsold";
  }
}
