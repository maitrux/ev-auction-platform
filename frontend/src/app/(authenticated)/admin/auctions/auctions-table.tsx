"use client";

import { AuctionOutcomeBadge } from "@/components/auction-outcome-badge";
import { SortableTableHeader } from "@/components/sortable-table-header";
import { useTableSort } from "@/hooks/use-table-sort";
import {
  formatAuctionStatus,
  formatCurrency,
  formatDate,
} from "@/lib/format";
import {
  compareByOrder,
  sortBy,
  type SortDirection,
} from "@/lib/table-sort";
import type { AuctionListItem, AuctionOutcome, AuctionStatus } from "@/types";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface AuctionsTableProps {
  auctions: AuctionListItem[];
}

type AuctionSortKey =
  | "id"
  | "vehicle"
  | "status"
  | "outcome"
  | "startsAt"
  | "endsAt"
  | "bidCount"
  | "highestBid";

const AUCTION_STATUS_ORDER: AuctionStatus[] = [
  "LIVE",
  "SCHEDULED",
  "ENDED",
  "DRAFT",
  "CANCELLED",
];

const AUCTION_OUTCOME_ORDER: AuctionOutcome[] = ["PENDING", "SOLD", "UNSOLD"];

function getAuctionSortValue(
  auction: AuctionListItem,
  key: AuctionSortKey,
): unknown {
  switch (key) {
    case "id":
      return auction.id;
    case "vehicle":
      return `${auction.vehicle.make} ${auction.vehicle.model}`;
    case "status":
      return compareByOrder(auction.status, AUCTION_STATUS_ORDER);
    case "outcome":
      return compareByOrder(auction.outcome, AUCTION_OUTCOME_ORDER);
    case "startsAt":
      return auction.startsAt ? new Date(auction.startsAt).getTime() : null;
    case "endsAt":
      return auction.endsAt ? new Date(auction.endsAt).getTime() : null;
    case "bidCount":
      return auction.bidCount;
    case "highestBid":
      return auction.highestBid;
  }
}

const AUCTION_SORT_COLUMNS: {
  key: AuctionSortKey;
  label: string;
}[] = [
  { key: "id", label: "Auction ID" },
  { key: "vehicle", label: "Vehicle" },
  { key: "status", label: "Status" },
  { key: "outcome", label: "Outcome" },
  { key: "startsAt", label: "Start" },
  { key: "endsAt", label: "End" },
  { key: "bidCount", label: "Bids" },
  { key: "highestBid", label: "Highest bid" },
];

export function AuctionsTable({ auctions }: AuctionsTableProps) {
  const router = useRouter();
  const { sortKey, direction, toggleSort } = useTableSort<AuctionSortKey>(
    "startsAt",
    "desc",
  );

  const sortedAuctions = useMemo(
    () =>
      sortBy(auctions, (auction) => getAuctionSortValue(auction, sortKey), direction),
    [auctions, sortKey, direction],
  );

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
            {AUCTION_SORT_COLUMNS.map((column) => (
              <SortableTableHeader
                key={column.key}
                label={column.label}
                sortKey={column.key}
                activeSortKey={sortKey}
                direction={direction as SortDirection}
                onSort={toggleSort}
              />
            ))}
          </tr>
        </thead>

        <tbody>
          {sortedAuctions.map((auction) => {
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
