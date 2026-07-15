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
import { useMemo } from "react";

interface BidsTableProps {
  bids: Bid[];
}

type BidGroup = {
  auction: Bid["auction"];
  bids: Bid[];
};

function groupBidsByAuction(bids: Bid[]): BidGroup[] {
  const groups = new Map<string, Bid[]>();

  for (const bid of bids) {
    const existing = groups.get(bid.auction.id) ?? [];
    existing.push(bid);
    groups.set(bid.auction.id, existing);
  }

  return Array.from(groups.values())
    .map((groupBids) => ({
      auction: groupBids[0].auction,
      bids: groupBids.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    }))
    .sort(
      (a, b) =>
        new Date(b.bids[0].createdAt).getTime() -
        new Date(a.bids[0].createdAt).getTime(),
    );
}

function HistoryIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

function BidHistoryPopover({
  bids,
  vehicleLabel,
}: {
  bids: Bid[];
  vehicleLabel: string;
}) {
  return (
    <span
      className="group/history relative inline-flex"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label={`View bid history for ${vehicleLabel}`}
      >
        <HistoryIcon />
      </button>

      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 w-64 rounded-lg border border-gray-200 bg-white p-3 text-left opacity-0 shadow-lg transition-opacity group-focus-within/history:pointer-events-auto group-focus-within/history:opacity-100 group-hover/history:pointer-events-auto group-hover/history:opacity-100"
      >
        <p className="mb-2 text-xs font-medium text-gray-500">Bid history</p>
        <ul className="space-y-2">
          {bids.map((bid, index) => (
            <li
              key={bid.id}
              className="flex items-start justify-between gap-3 text-sm"
            >
              <span className="font-medium text-gray-900">
                {formatCurrency(bid.amount)}
                {index === 0 ? (
                  <span className="ml-1.5 text-xs font-normal text-gray-400">
                    Latest
                  </span>
                ) : null}
              </span>
              <span className="shrink-0 text-xs text-gray-500">
                {formatDateTime(bid.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </span>
  );
}

export function BidsTable({ bids }: BidsTableProps) {
  const router = useRouter();
  const bidGroups = useMemo(() => groupBidsByAuction(bids), [bids]);

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
            <th className="px-4 py-3">Latest bid</th>
            <th className="px-4 py-3">Placed</th>
            <th className="px-4 py-3">Auction ends</th>
          </tr>
        </thead>

        <tbody>
          {bidGroups.map((group) => {
            const latestBid = group.bids[0];
            const hasHistory = group.bids.length > 1;
            const status = formatAuctionStatus(group.auction.status);
            const { vehicle } = group.auction;
            const vehicleLabel = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
            const href = getDealerAuctionDetailHref(
              group.auction.id,
              DealerAuctionFrom.BIDS,
            );
            const won = group.bids.some((bid) => bid.auction.won);

            return (
              <tr
                key={group.auction.id}
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
                aria-label={`View auction for ${vehicleLabel}`}
              >
                <td className="px-4 py-3 text-sm text-gray-500">
                  #{group.auction.id.slice(0, 8)}
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
                  {group.auction.outcome ? (
                    <DealerAuctionOutcomeBadge
                      outcome={group.auction.outcome}
                      won={won}
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="overflow-visible px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span>{formatCurrency(latestBid.amount)}</span>
                    {hasHistory ? (
                      <BidHistoryPopover
                        bids={group.bids}
                        vehicleLabel={vehicleLabel}
                      />
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {formatDateTime(latestBid.createdAt)}
                </td>
                <td className="px-4 py-3">
                  {group.auction.endsAt
                    ? formatDate(group.auction.endsAt)
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
