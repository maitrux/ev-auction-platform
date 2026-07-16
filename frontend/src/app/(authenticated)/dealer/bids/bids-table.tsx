"use client";

import { DealerAuctionOutcomeBadge } from "@/components/dealer-auction-outcome-badge";
import { SortableTableHeader } from "@/components/sortable-table-header";
import { useTableSort } from "@/hooks/use-table-sort";
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
import {
  compareByOrder,
  sortBy,
  type SortDirection,
} from "@/lib/table-sort";
import type { AuctionStatus } from "@/types/auction";
import type { DealerAuctionOutcome } from "@/types/dealer-auction-outcome";
import type { Bid } from "@/types/bid";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface BidsTableProps {
  bids: Bid[];
}

type BidGroup = {
  auction: Bid["auction"];
  bids: Bid[];
};

type BidGroupSortKey =
  | "id"
  | "vehicle"
  | "status"
  | "outcome"
  | "latestBid"
  | "placed"
  | "endsAt";

const BID_AUCTION_STATUS_ORDER: AuctionStatus[] = [
  "LIVE",
  "SCHEDULED",
  "ENDED",
  "CANCELLED",
];

const DEALER_OUTCOME_ORDER: DealerAuctionOutcome[] = ["PENDING", "RESOLVED"];

const BID_GROUP_SORT_COLUMNS: {
  key: BidGroupSortKey;
  label: string;
}[] = [
  { key: "id", label: "Auction ID" },
  { key: "vehicle", label: "Vehicle" },
  { key: "status", label: "Auction status" },
  { key: "outcome", label: "Outcome" },
  { key: "latestBid", label: "Latest bid" },
  { key: "placed", label: "Placed" },
  { key: "endsAt", label: "Auction ends" },
];

function getBidGroupSortValue(group: BidGroup, key: BidGroupSortKey): unknown {
  const latestBid = group.bids[0];
  const { auction } = group;
  const { vehicle } = auction;

  switch (key) {
    case "id":
      return group.auction.id;
    case "vehicle":
      return `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
    case "status":
      return compareByOrder(auction.status, BID_AUCTION_STATUS_ORDER);
    case "outcome":
      return compareByOrder(auction.outcome, DEALER_OUTCOME_ORDER);
    case "latestBid":
      return latestBid.amount;
    case "placed":
      return new Date(latestBid.createdAt).getTime();
    case "endsAt":
      return auction.endsAt ? new Date(auction.endsAt).getTime() : null;
  }
}

function groupBidsByAuction(bids: Bid[]): BidGroup[] {
  const groups = new Map<string, Bid[]>();

  for (const bid of bids) {
    const existing = groups.get(bid.auction.id) ?? [];
    existing.push(bid);
    groups.set(bid.auction.id, existing);
  }

  return Array.from(groups.values()).map((groupBids) => ({
    auction: groupBids[0].auction,
    bids: groupBids.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  }));
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
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  function clearCloseTimeout() {
    if (closeTimeoutRef.current != null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }

  function updatePosition() {
    const button = buttonRef.current;

    if (!button) {
      return;
    }

    const rect = button.getBoundingClientRect();
    const popoverWidth = 256;
    const left = Math.min(
      Math.max(8, rect.right - popoverWidth),
      window.innerWidth - popoverWidth - 8,
    );

    setPosition({
      top: rect.bottom + 8,
      left,
    });
  }

  function show() {
    clearCloseTimeout();
    updatePosition();
    setOpen(true);
  }

  function scheduleClose() {
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => setOpen(false), 100);
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleReposition() {
      updatePosition();
    }

    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);

    return () => {
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [open]);

  const popover =
    open && position ? (
      <div
        role="tooltip"
        style={{ top: position.top, left: position.left }}
        className="fixed z-50 w-64 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-lg"
        onMouseEnter={clearCloseTimeout}
        onMouseLeave={scheduleClose}
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
    ) : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label={`View bid history for ${vehicleLabel}`}
        onClick={(event) => event.stopPropagation()}
        onMouseEnter={show}
        onMouseLeave={scheduleClose}
        onFocus={show}
        onBlur={scheduleClose}
      >
        <HistoryIcon />
      </button>

      {typeof document !== "undefined" && popover
        ? createPortal(popover, document.body)
        : null}
    </>
  );
}

export function BidsTable({ bids }: BidsTableProps) {
  const router = useRouter();
  const bidGroups = useMemo(() => groupBidsByAuction(bids), [bids]);
  const { sortKey, direction, toggleSort } = useTableSort<BidGroupSortKey>(
    "placed",
    "desc",
  );
  const sortedBidGroups = useMemo(
    () =>
      sortBy(
        bidGroups,
        (group) => getBidGroupSortValue(group, sortKey),
        direction,
      ),
    [bidGroups, sortKey, direction],
  );

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
            {BID_GROUP_SORT_COLUMNS.map((column) => (
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
          {sortedBidGroups.map((group) => {
            const latestBid = group.bids[0];
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
                className="cursor-pointer border-b hover:bg-gray-50"
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
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span>{formatCurrency(latestBid.amount)}</span>

                    <span onClick={(event) => event.stopPropagation()}>
                      <BidHistoryPopover
                        bids={group.bids}
                        vehicleLabel={vehicleLabel}
                      />
                    </span>
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
