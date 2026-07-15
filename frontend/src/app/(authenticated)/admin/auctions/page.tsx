import { getAuctions } from "@/lib/server/auctions";
import type { AuctionListItem } from "@/types";
import { AuctionsPageClient } from "./auctions-page";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to load auctions. Please try again later.";
}

export default async function Page() {
  let auctions: AuctionListItem[] = [];
  let error: string | null = null;

  try {
    auctions = await getAuctions();
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
