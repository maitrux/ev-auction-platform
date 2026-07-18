import { matchesStatusFilter } from "@/lib/auction-filters";
import { sortBy, type SortDirection } from "@/lib/table-sort";
import type { AuctionStatus, DealerAuctionListItem } from "@/types/auction";
import type { VehicleCondition } from "@/types/vehicle";

export type DealerMyBidFilter = "HAS_BID" | "NO_BID";

export type DealerAuctionSortKey =
  | "recommended"
  | "startsAt"
  | "endsAt"
  | "year"
  | "mileageKm"
  | "make"
  | "myBid";

export type DealerAuctionRangeFilters = {
  yearMin: string;
  yearMax: string;
  mileageKmMax: string;
  startsFrom: string;
  startsTo: string;
};

export const EMPTY_DEALER_AUCTION_RANGE_FILTERS: DealerAuctionRangeFilters = {
  yearMin: "",
  yearMax: "",
  mileageKmMax: "",
  startsFrom: "",
  startsTo: "",
};

export const VEHICLE_CONDITIONS: VehicleCondition[] = [
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "POOR",
];

export function getUniqueMakes(auctions: DealerAuctionListItem[]): string[] {
  return [...new Set(auctions.map((auction) => auction.vehicle.make))].sort(
    (a, b) => a.localeCompare(b),
  );
}

export function getUniqueCountries(auctions: DealerAuctionListItem[]): string[] {
  return [...new Set(auctions.map((auction) => auction.vehicle.country))].sort(
    (a, b) => a.localeCompare(b),
  );
}

function matchesSetFilter<T extends string>(
  value: T,
  selected: ReadonlySet<T>,
): boolean {
  return selected.size === 0 || selected.has(value);
}

function matchesMyBidFilter(
  myBid: number | null,
  selected: DealerMyBidFilter | null,
): boolean {
  if (!selected) {
    return true;
  }

  if (selected === "HAS_BID") {
    return myBid != null;
  }

  return myBid == null;
}

function parseOptionalNumber(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function parseOptionalDate(value: string): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = new Date(`${value}T00:00:00`).getTime();

  return Number.isFinite(parsed) ? parsed : null;
}

export function matchesDealerAuctionRangeFilters(
  auction: DealerAuctionListItem,
  filters: DealerAuctionRangeFilters,
): boolean {
  const yearMin = parseOptionalNumber(filters.yearMin);
  const yearMax = parseOptionalNumber(filters.yearMax);
  const mileageKmMax = parseOptionalNumber(filters.mileageKmMax);
  const startsFrom = parseOptionalDate(filters.startsFrom);
  const startsTo = parseOptionalDate(filters.startsTo);

  if (yearMin != null && auction.vehicle.year < yearMin) {
    return false;
  }

  if (yearMax != null && auction.vehicle.year > yearMax) {
    return false;
  }

  if (mileageKmMax != null && auction.vehicle.mileageKm > mileageKmMax) {
    return false;
  }

  if (startsFrom != null) {
    const startsAt = auction.startsAt
      ? new Date(auction.startsAt).getTime()
      : null;

    if (startsAt == null || startsAt < startsFrom) {
      return false;
    }
  }

  if (startsTo != null) {
    const startsAt = auction.startsAt
      ? new Date(auction.startsAt).getTime()
      : null;
    const endOfDay = startsTo + 24 * 60 * 60 * 1000 - 1;

    if (startsAt == null || startsAt > endOfDay) {
      return false;
    }
  }

  return true;
}

export function matchesDealerAuctionFilters(
  auction: DealerAuctionListItem,
  options: {
    statuses: ReadonlySet<AuctionStatus>;
    makes: ReadonlySet<string>;
    conditions: ReadonlySet<VehicleCondition>;
    countries: ReadonlySet<string>;
    myBid: DealerMyBidFilter | null;
    ranges: DealerAuctionRangeFilters;
  },
): boolean {
  return (
    matchesStatusFilter(auction.status, options.statuses) &&
    matchesSetFilter(auction.vehicle.make, options.makes) &&
    matchesSetFilter(auction.vehicle.condition, options.conditions) &&
    matchesSetFilter(auction.vehicle.country, options.countries) &&
    matchesMyBidFilter(auction.myBid, options.myBid) &&
    matchesDealerAuctionRangeFilters(auction, options.ranges)
  );
}

function compareRecommended(
  a: DealerAuctionListItem,
  b: DealerAuctionListItem,
): number {
  if (a.status !== b.status) {
    return a.status === "LIVE" ? -1 : 1;
  }

  if (a.status === "LIVE") {
    return (
      new Date(a.endsAt ?? 0).getTime() - new Date(b.endsAt ?? 0).getTime()
    );
  }

  return (
    new Date(a.startsAt ?? 0).getTime() - new Date(b.startsAt ?? 0).getTime()
  );
}

function getDealerAuctionSortValue(
  auction: DealerAuctionListItem,
  key: DealerAuctionSortKey,
): unknown {
  switch (key) {
    case "startsAt":
      return auction.startsAt ? new Date(auction.startsAt).getTime() : null;
    case "endsAt":
      return auction.endsAt ? new Date(auction.endsAt).getTime() : null;
    case "year":
      return auction.vehicle.year;
    case "mileageKm":
      return auction.vehicle.mileageKm;
    case "make":
      return `${auction.vehicle.make} ${auction.vehicle.model}`;
    case "myBid":
      return auction.myBid;
    default:
      return null;
  }
}

export function sortDealerAuctions(
  auctions: DealerAuctionListItem[],
  sortKey: DealerAuctionSortKey,
  direction: SortDirection,
): DealerAuctionListItem[] {
  if (sortKey === "recommended") {
    return [...auctions].sort(compareRecommended);
  }

  return sortBy(
    auctions,
    (auction) => getDealerAuctionSortValue(auction, sortKey),
    direction,
    { nullsLast: true },
  );
}

export function countDealerAuctionActiveFilters(options: {
  statuses: ReadonlySet<AuctionStatus>;
  makes: ReadonlySet<string>;
  conditions: ReadonlySet<VehicleCondition>;
  countries: ReadonlySet<string>;
  myBid: DealerMyBidFilter | null;
  ranges: DealerAuctionRangeFilters;
}): number {
  let count = 0;

  if (options.statuses.size > 0) count++;
  if (options.makes.size > 0) count++;
  if (options.conditions.size > 0) count++;
  if (options.countries.size > 0) count++;
  if (options.myBid) count++;

  for (const value of Object.values(options.ranges)) {
    if (value.trim()) {
      count++;
    }
  }

  return count;
}
