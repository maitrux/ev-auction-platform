import type { DealerAuctionListItem } from "@/types/auction";

import { AuctionCard } from "./auction-card";

interface AuctionsGridProps {
  auctions: DealerAuctionListItem[];
}

export function AuctionsGrid({ auctions }: AuctionsGridProps) {
  if (auctions.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-gray-600">
        No live or upcoming auctions right now.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {auctions.map((auction) => (
        <AuctionCard
          key={auction.id}
          auction={auction}
        />
      ))}
    </div>
  );
}
