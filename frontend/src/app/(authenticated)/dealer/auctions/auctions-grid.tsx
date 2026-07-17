"use client";

import {
  FilterMenu,
  FilterMenuGroup,
  NoFilterResults,
  type FilterOption,
} from "@/components/filter-menu";
import { useMultiSelectFilter } from "@/hooks/use-multi-select-filter";
import { matchesStatusFilter } from "@/lib/auction-filters";
import { formatAuctionStatus } from "@/lib/format";
import type { AuctionStatus, DealerAuctionListItem } from "@/types/auction";
import { useMemo } from "react";

import { AuctionCard } from "./auction-card";

interface AuctionsGridProps {
  auctions: DealerAuctionListItem[];
}

const DEALER_OPEN_STATUSES: AuctionStatus[] = ["LIVE", "SCHEDULED"];

const STATUS_FILTER_OPTIONS: FilterOption<AuctionStatus>[] =
  DEALER_OPEN_STATUSES.map((status) => ({
    value: status,
    label: formatAuctionStatus(status).label,
  }));

export function AuctionsGrid({ auctions }: AuctionsGridProps) {
  const { selected: selectedStatuses, toggle: toggleStatus, clear: clearStatuses } =
    useMultiSelectFilter<AuctionStatus>();

  const filteredAuctions = useMemo(
    () =>
      auctions.filter((auction) =>
        matchesStatusFilter(auction.status, selectedStatuses),
      ),
    [auctions, selectedStatuses],
  );

  if (auctions.length === 0) {
    return (
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Open Auctions</h1>
        </div>
        <div className="rounded-lg border bg-white p-8 text-center text-gray-600">
          No live or upcoming auctions right now.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Open Auctions</h1>
        <FilterMenu
          activeCount={selectedStatuses.size}
          onClearAll={clearStatuses}
        >
          <FilterMenuGroup
            legend="Status"
            options={STATUS_FILTER_OPTIONS}
            selected={selectedStatuses}
            onToggle={toggleStatus}
          />
        </FilterMenu>
      </div>

      {filteredAuctions.length === 0 ? (
        <NoFilterResults message="No auctions match the selected filters." />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAuctions.map((auction) => (
            <AuctionCard
              key={auction.id}
              auction={auction}
            />
          ))}
        </div>
      )}
    </div>
  );
}
