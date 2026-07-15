import { Bid } from "@/types/bid";
import { BidsTable } from "./bids-table";

interface BidsPageProps {
  bids: Bid[];
  error: string | null;
}

export function BidsPageClient({ bids, error }: BidsPageProps) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My bids</h1>
      </div>

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
