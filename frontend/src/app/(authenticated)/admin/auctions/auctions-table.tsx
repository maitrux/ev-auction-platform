"use client";

import { AuctionOutcomeBadge } from "@/components/auction-outcome-badge";
import {
  FilterMenu,
  FilterMenuGroup,
  NoFilterResults,
  type FilterOption,
} from "@/components/filter-menu";
import { SortableTableHeader } from "@/components/sortable-table-header";
import { useMultiSelectFilter } from "@/hooks/use-multi-select-filter";
import { useTableSort } from "@/hooks/use-table-sort";
import {
  matchesAdminOutcomeFilter,
  matchesStatusFilter,
  type AdminOutcomeFilter,
} from "@/lib/auction-filters";
import {
  formatAuctionOutcome,
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
  headerActions?: React.ReactNode;
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

const NULLS_LAST_SORT_KEYS = new Set<AuctionSortKey>(["startsAt", "endsAt"]);

const ADMIN_STATUSES: AuctionStatus[] = [
  "DRAFT",
  "SCHEDULED",
  "LIVE",
  "ENDED",
  "CANCELLED",
];

const ADMIN_OUTCOME_FILTERS: AdminOutcomeFilter[] = [
  "NONE",
  "PENDING",
  "SOLD",
  "UNSOLD",
];

const STATUS_FILTER_OPTIONS: FilterOption<AuctionStatus>[] =
  ADMIN_STATUSES.map((status) => ({
    value: status,
    label: formatAuctionStatus(status).label,
  }));

const OUTCOME_FILTER_OPTIONS: FilterOption<AdminOutcomeFilter>[] =
  ADMIN_OUTCOME_FILTERS.map((outcome) => ({
    value: outcome,
    label:
      outcome === "NONE"
        ? "No outcome"
        : formatAuctionOutcome(outcome).label,
  }));

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

export function AuctionsTable({ auctions, headerActions }: AuctionsTableProps) {
  const router = useRouter();
  const { sortKey, direction, toggleSort } = useTableSort<AuctionSortKey>(
    "startsAt",
    "desc",
  );
  const { selected: selectedStatuses, toggle: toggleStatus, clear: clearStatuses } =
    useMultiSelectFilter<AuctionStatus>();
  const { selected: selectedOutcomes, toggle: toggleOutcome, clear: clearOutcomes } =
    useMultiSelectFilter<AdminOutcomeFilter>();

  const activeFilterCount = selectedStatuses.size + selectedOutcomes.size;

  function clearAllFilters() {
    clearStatuses();
    clearOutcomes();
  }

  const filteredAuctions = useMemo(
    () =>
      auctions.filter(
        (auction) =>
          matchesStatusFilter(auction.status, selectedStatuses) &&
          matchesAdminOutcomeFilter(auction.outcome, selectedOutcomes),
      ),
    [auctions, selectedStatuses, selectedOutcomes],
  );

  const sortedAuctions = useMemo(
    () =>
      sortBy(
        filteredAuctions,
        (auction) => getAuctionSortValue(auction, sortKey),
        direction,
        { nullsLast: NULLS_LAST_SORT_KEYS.has(sortKey) },
      ),
    [filteredAuctions, sortKey, direction],
  );

  if (auctions.length === 0) {
    return (
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Auctions</h1>
          {headerActions ? (
            <div className="flex items-center gap-3">{headerActions}</div>
          ) : null}
        </div>
        <div className="rounded-lg border bg-white p-8 text-center text-gray-600">
          No auctions yet. Create your first auction to get started.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Auctions</h1>
        <div className="flex items-center gap-3">
          <FilterMenu
            activeCount={activeFilterCount}
            onClearAll={clearAllFilters}
          >
            <FilterMenuGroup
              legend="Status"
              options={STATUS_FILTER_OPTIONS}
              selected={selectedStatuses}
              onToggle={toggleStatus}
            />
            <FilterMenuGroup
              legend="Outcome"
              options={OUTCOME_FILTER_OPTIONS}
              selected={selectedOutcomes}
              onToggle={toggleOutcome}
            />
          </FilterMenu>
          {headerActions}
        </div>
      </div>

      {sortedAuctions.length === 0 ? (
        <NoFilterResults message="No auctions match the selected filters." />
      ) : (
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
      )}
    </div>
  );
}
