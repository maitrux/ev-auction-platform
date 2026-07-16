"use client";

import type { DealerAuctionListItem } from "@/types/auction";

import { AuctionsGrid } from "./auctions-grid";

interface AuctionsPageClientProps {
  auctions: DealerAuctionListItem[];
  error: string | null;
}

export function AuctionsPageClient({
  auctions,
  error,
}: AuctionsPageClientProps) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Open Auctions</h1>
      </div>

      {error && (
        <div
          className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      {!error && <AuctionsGrid auctions={auctions} />}
    </>
  );
}
