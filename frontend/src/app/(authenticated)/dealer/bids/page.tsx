import { getMyBids } from "@/lib/server/bids";
import { Bid } from "@/types/bid";
import { BidsPageClient } from "./bids-page";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to load auctions. Please try again later.";
}

export default async function Page() {
  let bids: Bid[] = [];
  let error: string | null = null;

  try {
    bids = await getMyBids();
  } catch (err) {
    error = getErrorMessage(err);
  }

  return (
    <main className="p-6">
      <BidsPageClient
        bids={bids}
        error={error}
      />
    </main>
  );
}
