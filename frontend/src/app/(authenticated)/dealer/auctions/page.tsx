import { getOpenAuctions } from "@/lib/server/dealer-auctions";
import type { DealerAuctionListItem } from "@/types/auction";

import { AuctionsPageClient } from "./auctions-page";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to load auctions. Please try again later.";
}

export default async function Page() {
  let auctions: DealerAuctionListItem[] = [];
  let error: string | null = null;

  try {
    auctions = await getOpenAuctions();
  } catch (err) {
    error = getErrorMessage(err);
  }

  return (
    <main className="p-6">
      <AuctionsPageClient
        auctions={auctions}
        error={error}
      />
    </main>
  );
}
