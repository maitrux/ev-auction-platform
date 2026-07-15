"use client";

import { AuctionOutcomeBadge } from "@/components/auction-outcome-badge";
import {
  formatAuctionStatus,
  formatCurrency,
  formatDate,
} from "@/lib/format";
import type { AuctionListItem } from "@/types";
import { useRouter } from "next/navigation";

interface AuctionsTableProps {
  auctions: AuctionListItem[];
}

export function AuctionsTable({ auctions }: AuctionsTableProps) {
  const router = useRouter();

  if (auctions.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-gray-600">
        No auctions yet. Create your first auction to get started.
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
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Outcome</th>
            <th className="px-4 py-3">Start</th>
            <th className="px-4 py-3">End</th>
            <th className="px-4 py-3">Bids</th>
            <th className="px-4 py-3">Highest bid</th>
          </tr>
        </thead>

        <tbody>
          {auctions.map((auction) => {
            const status = formatAuctionStatus(auction.status);
            const href = `/admin/auctions/${auction.id}`;
            const vehicleLabel = `${auction.vehicle.make} ${auction.vehicle.model}`;

            return (
              <tr
                key={auction.id}
                onClick={() => router.push(href)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(href);
                  }
                }}
                tabIndex={0}
                role="link"
                aria-label={`View auction for ${vehicleLabel}`}
                className="cursor-pointer border-b hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-sm text-gray-500">
                  #{auction.id.slice(0, 8)}
                </td>
                <td className="px-4 py-3 font-medium">{vehicleLabel}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.badgeClassName}`}
                  >
                    {status.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {auction.outcome ? (
                    <AuctionOutcomeBadge outcome={auction.outcome} />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3">
                  {auction.startsAt ? formatDate(auction.startsAt) : "-"}
                </td>
                <td className="px-4 py-3">
                  {auction.endsAt ? formatDate(auction.endsAt) : "-"}
                </td>
                <td className="px-4 py-3">{auction.bidCount}</td>
                <td className="px-4 py-3">
                  {auction.highestBid != null
                    ? formatCurrency(auction.highestBid)
                    : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
