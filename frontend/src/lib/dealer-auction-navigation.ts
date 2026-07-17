export const DealerAuctionFrom = {
  AUCTIONS: "auctions",
  BIDS: "bids",
} as const;

export type DealerAuctionFrom =
  (typeof DealerAuctionFrom)[keyof typeof DealerAuctionFrom];

export function getDealerAuctionDetailHref(
  auctionId: string,
  from: DealerAuctionFrom,
): string {
  return `/dealer/auctions/${auctionId}?from=${from}`;
}

export function getDealerAuctionBackLink(from?: string): {
  href: string;
  label: string;
} {
  if (from === DealerAuctionFrom.BIDS) {
    return { href: "/dealer/bids", label: "← Back to My Bids" };
  }

  return { href: "/dealer/auctions", label: "← Back to Open Auctions" };
}
