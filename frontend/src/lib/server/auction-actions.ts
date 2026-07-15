"use server";

import {
  createAuctionWithVehicle,
  updateAuction,
} from "@/lib/server/auctions";
import type { CreateAuctionWithVehicleInput } from "@/types";

export async function createAuctionWithVehicleAction(
  input: CreateAuctionWithVehicleInput,
) {
  return createAuctionWithVehicle(input);
}

export async function cancelAuctionAction(id: string) {
  return updateAuction(id, { status: "CANCELLED" });
}

export async function publishAuctionAction(
  id: string,
  data: {
    startsAt: string;
    endsAt: string;
    reservePrice: number;
    minIncrement: number;
  },
) {
  return updateAuction(id, {
    publish: true,
    ...data,
  });
}
