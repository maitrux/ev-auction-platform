import type { CreateVehicleInput, Vehicle, VehicleFormState } from "./vehicle";
import { toCreateVehicleInput } from "./vehicle";

export type AuctionStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "LIVE"
  | "ENDED"
  | "CANCELLED";

export type AuctionResult = "SOLD" | "UNSOLD";

export interface AuctionListItem {
  id: string;
  status: AuctionStatus;
  startsAt: string | null;
  endsAt: string | null;
  bidCount: number;
  highestBid: number | null;
  vehicle: {
    make: string;
    model: string;
    year: number;
  };
}

export interface AuctionBid {
  id: string;
  amount: number;
  createdAt: string;
  dealer: {
    name: string;
  };
}

export interface AuctionDetail extends AuctionListItem {
  reservePrice: number | null;
  minIncrement: number | null;
  vehicle: Vehicle;
  bids: AuctionBid[];
  winningBid: {
    amount: number;
    dealer: {
      name: string;
    };
  } | null;
  result: AuctionResult | null;
}

export type AuctionFormState = {
  startsAt: string;
  endsAt: string;
  reservePrice: string;
  minIncrement: string;
};

export const initialAuctionForm: AuctionFormState = {
  startsAt: "",
  endsAt: "",
  reservePrice: "",
  minIncrement: "",
};

export interface CreateAuctionWithVehicleInput {
  saveAsDraft: boolean;
  vehicle: CreateVehicleInput;
  auction?: {
    startsAt: string;
    endsAt: string;
    reservePrice: number;
    minIncrement: number;
  };
}

export function toCreateAuctionWithVehicleInput(
  vehicleForm: VehicleFormState,
  auctionForm: AuctionFormState,
  saveAsDraft: boolean,
): CreateAuctionWithVehicleInput {
  const input: CreateAuctionWithVehicleInput = {
    saveAsDraft,
    vehicle: toCreateVehicleInput(vehicleForm),
  };

  if (!saveAsDraft) {
    input.auction = {
      startsAt: auctionForm.startsAt,
      endsAt: auctionForm.endsAt,
      reservePrice: Number(auctionForm.reservePrice),
      minIncrement: Number(auctionForm.minIncrement),
    };
  }

  return input;
}
