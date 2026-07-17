import { Bid } from "@/types/bid";
import { BidsTable } from "./bids-table";

interface BidsPageProps {
  bids: Bid[];
  error: string | null;
}

export function BidsPageClient({ bids, error }: BidsPageProps) {
  return (
    <>
      {error && (
        <div
          className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      {!error && <BidsTable bids={bids} />}
    </>
  );
}
