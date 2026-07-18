"use client";

import {
  FilterMenu,
  FilterMenuGroup,
  NoFilterResults,
  type FilterOption,
} from "@/components/filter-menu";
import { useMultiSelectFilter } from "@/hooks/use-multi-select-filter";
import {
  countDealerAuctionActiveFilters,
  EMPTY_DEALER_AUCTION_RANGE_FILTERS,
  getUniqueCountries,
  getUniqueMakes,
  matchesDealerAuctionFilters,
  sortDealerAuctions,
  VEHICLE_CONDITIONS,
  type DealerAuctionRangeFilters,
  type DealerAuctionSortKey,
  type DealerMyBidFilter,
} from "@/lib/dealer-auction-filters";
import { formatAuctionStatus, formatVehicleCondition } from "@/lib/format";
import type { SortDirection } from "@/lib/table-sort";
import type { AuctionStatus, DealerAuctionListItem } from "@/types/auction";
import type { VehicleCondition } from "@/types/vehicle";
import { useMemo, useState } from "react";

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

const CONDITION_FILTER_OPTIONS: FilterOption<VehicleCondition>[] =
  VEHICLE_CONDITIONS.map((condition) => ({
    value: condition,
    label: formatVehicleCondition(condition).label,
  }));

const MY_BID_FILTER_OPTIONS: {
  value: DealerMyBidFilter;
  label: string;
}[] = [
  { value: "HAS_BID", label: "Has my bid" },
  { value: "NO_BID", label: "No bid yet" },
];

const SORT_OPTIONS: {
  value: `${DealerAuctionSortKey}:${SortDirection}`;
  label: string;
}[] = [
  { value: "recommended:asc", label: "Recommended" },
  { value: "startsAt:asc", label: "Start date (soonest)" },
  { value: "startsAt:desc", label: "Start date (latest)" },
  { value: "endsAt:asc", label: "End date (soonest)" },
  { value: "endsAt:desc", label: "End date (latest)" },
  { value: "year:desc", label: "Year (newest)" },
  { value: "year:asc", label: "Year (oldest)" },
  { value: "mileage:asc", label: "Mileage (lowest)" },
  { value: "mileage:desc", label: "Mileage (highest)" },
  { value: "make:asc", label: "Brand (A–Z)" },
  { value: "make:desc", label: "Brand (Z–A)" },
  { value: "myBid:desc", label: "My bid (highest)" },
  { value: "myBid:asc", label: "My bid (lowest)" },
];

function FilterRangeField({
  label,
  id,
  value,
  onChange,
  type = "number",
  min,
  max,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: "number" | "date";
  min?: string | number;
  max?: string | number;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm text-gray-700"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded border px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
}

function parseSortValue(value: string): {
  sortKey: DealerAuctionSortKey;
  direction: SortDirection;
} {
  const [sortKey, direction] = value.split(":") as [
    DealerAuctionSortKey,
    SortDirection,
  ];

  return { sortKey, direction };
}

export function AuctionsGrid({ auctions }: AuctionsGridProps) {
  const {
    selected: selectedStatuses,
    toggle: toggleStatus,
    clear: clearStatuses,
  } = useMultiSelectFilter<AuctionStatus>();
  const {
    selected: selectedMakes,
    toggle: toggleMake,
    clear: clearMakes,
  } = useMultiSelectFilter<string>();
  const {
    selected: selectedConditions,
    toggle: toggleCondition,
    clear: clearConditions,
  } = useMultiSelectFilter<VehicleCondition>();
  const {
    selected: selectedCountries,
    toggle: toggleCountry,
    clear: clearCountries,
  } = useMultiSelectFilter<string>();
  const [myBidFilter, setMyBidFilter] = useState<DealerMyBidFilter | null>(
    null,
  );
  const [rangeFilters, setRangeFilters] = useState<DealerAuctionRangeFilters>(
    EMPTY_DEALER_AUCTION_RANGE_FILTERS,
  );
  const [sortValue, setSortValue] = useState("recommended:asc");

  const makeOptions = useMemo(
    () =>
      getUniqueMakes(auctions).map((make) => ({
        value: make,
        label: make,
      })),
    [auctions],
  );

  const countryOptions = useMemo(
    () =>
      getUniqueCountries(auctions).map((country) => ({
        value: country,
        label: country,
      })),
    [auctions],
  );

  const activeFilterCount = countDealerAuctionActiveFilters({
    statuses: selectedStatuses,
    makes: selectedMakes,
    conditions: selectedConditions,
    countries: selectedCountries,
    myBid: myBidFilter,
    ranges: rangeFilters,
  });

  const { sortKey, direction } = parseSortValue(sortValue);

  const filteredAuctions = useMemo(
    () =>
      auctions.filter((auction) =>
        matchesDealerAuctionFilters(auction, {
          statuses: selectedStatuses,
          makes: selectedMakes,
          conditions: selectedConditions,
          countries: selectedCountries,
          myBid: myBidFilter,
          ranges: rangeFilters,
        }),
      ),
    [
      auctions,
      selectedStatuses,
      selectedMakes,
      selectedConditions,
      selectedCountries,
      myBidFilter,
      rangeFilters,
    ],
  );

  const sortedAuctions = useMemo(
    () => sortDealerAuctions(filteredAuctions, sortKey, direction),
    [filteredAuctions, sortKey, direction],
  );

  function updateRangeFilter(
    key: keyof DealerAuctionRangeFilters,
    value: string,
  ) {
    setRangeFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function clearAllFilters() {
    clearStatuses();
    clearMakes();
    clearConditions();
    clearCountries();
    setMyBidFilter(null);
    setRangeFilters(EMPTY_DEALER_AUCTION_RANGE_FILTERS);
  }

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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Open Auctions</h1>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <span className="sr-only">Sort auctions</span>
            <select
              value={sortValue}
              onChange={(event) => setSortValue(event.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              aria-label="Sort auctions"
            >
              {SORT_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <FilterMenu
            activeCount={activeFilterCount}
            onClearAll={clearAllFilters}
            panelClassName="absolute right-0 z-20 mt-2 max-h-[70vh] w-80 overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
          >
            <FilterMenuGroup
              legend="Status"
              options={STATUS_FILTER_OPTIONS}
              selected={selectedStatuses}
              onToggle={toggleStatus}
            />

            {makeOptions.length > 0 ? (
              <FilterMenuGroup
                legend="Brand"
                options={makeOptions}
                selected={selectedMakes}
                onToggle={toggleMake}
              />
            ) : null}

            <FilterMenuGroup
              legend="Condition"
              options={CONDITION_FILTER_OPTIONS}
              selected={selectedConditions}
              onToggle={toggleCondition}
            />

            {countryOptions.length > 0 ? (
              <FilterMenuGroup
                legend="Country"
                options={countryOptions}
                selected={selectedCountries}
                onToggle={toggleCountry}
              />
            ) : null}

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-gray-900">
                My bids
              </legend>
              <div className="space-y-1">
                {MY_BID_FILTER_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="my-bid-filter"
                      checked={myBidFilter === option.value}
                      onChange={() => setMyBidFilter(option.value)}
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {option.label}
                  </label>
                ))}
                <label className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm text-gray-700 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="my-bid-filter"
                    checked={myBidFilter === null}
                    onChange={() => setMyBidFilter(null)}
                    className="border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Any
                </label>
              </div>
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-gray-900">
                Year
              </legend>
              <div className="grid grid-cols-2 gap-3">
                <FilterRangeField
                  label="From"
                  id="filter-year-min"
                  value={rangeFilters.yearMin}
                  onChange={(value) => updateRangeFilter("yearMin", value)}
                />
                <FilterRangeField
                  label="To"
                  id="filter-year-max"
                  value={rangeFilters.yearMax}
                  onChange={(value) => updateRangeFilter("yearMax", value)}
                />
              </div>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-gray-900">
                Mileage
              </legend>
              <FilterRangeField
                label="Max mileage (km)"
                id="filter-mileage-max"
                value={rangeFilters.mileageMax}
                onChange={(value) => updateRangeFilter("mileageMax", value)}
                min={0}
              />
            </fieldset>

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-gray-900">
                Start date
              </legend>
              <div className="grid grid-cols-2 gap-3">
                <FilterRangeField
                  label="From"
                  id="filter-starts-from"
                  type="date"
                  value={rangeFilters.startsFrom}
                  onChange={(value) => updateRangeFilter("startsFrom", value)}
                />
                <FilterRangeField
                  label="To"
                  id="filter-starts-to"
                  type="date"
                  value={rangeFilters.startsTo}
                  onChange={(value) => updateRangeFilter("startsTo", value)}
                />
              </div>
            </fieldset>
          </FilterMenu>
        </div>
      </div>

      {sortedAuctions.length === 0 ? (
        <NoFilterResults message="No auctions match the selected filters." />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedAuctions.map((auction) => (
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
