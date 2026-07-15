"use client";

import { DealerAuctionOutcomeBadge } from "@/components/dealer-auction-outcome-badge";
import {
  DealerAuctionFrom,
  getDealerAuctionDetailHref,
} from "@/lib/dealer-auction-navigation";
import {
  formatAuctionStatus,
  formatCurrency,
  formatDate,
  formatDateTime,
} from "@/lib/format";
import type { Bid } from "@/types/bid";
import { useRouter } from "next/navigation";

interface BidsTableProps {
  bids: Bid[];
}

export function BidsTable({ bids }: BidsTableProps) {
  const router = useRouter();

  if (bids.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-gray-600">
        You haven&apos;t placed any bids yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-gray-200">
          <tr>
            <th className="px-4 py-3">Auction ID</th>
            <th className="px-4 py-3">Vehicle</th>
            <th className="px-4 py-3">Auction status</th>
            <th className="px-4 py-3">Outcome</th>
            <th className="px-4 py-3">Your bid</th>
            <th className="px-4 py-3">Placed</th>
            <th className="px-4 py-3">Auction ends</th>
          </tr>
        </thead>

        <tbody>
          {bids.map((bid) => {
            const status = formatAuctionStatus(bid.auction.status);
            const { vehicle } = bid.auction;
            const href = getDealerAuctionDetailHref(
              bid.auction.id,
              DealerAuctionFrom.BIDS,
            );
            return (
              <tr
                key={bid.id}
                className="border-b hover:bg-gray-50"
                onClick={() => router.push(href)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(href);
                  }
                }}
                tabIndex={0}
                role="link"
                aria-label={`View auction for ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              >
                <td className="px-4 py-3 text-sm text-gray-500">
                  #{bid.auction.id.slice(0, 8)}
                </td>
                <td className="px-4 py-3 font-medium">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.badgeClassName}`}
                  >
                    {status.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {bid.auction.outcome ? (
                    <DealerAuctionOutcomeBadge
                      outcome={bid.auction.outcome}
                      won={bid.auction.won}
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3">{formatCurrency(bid.amount)}</td>
                <td className="px-4 py-3">{formatDateTime(bid.createdAt)}</td>
                <td className="px-4 py-3">
                  {bid.auction.endsAt ? formatDate(bid.auction.endsAt) : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
