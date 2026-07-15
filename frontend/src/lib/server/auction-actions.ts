"use server";

import {
  createAuctionWithVehicle,
  updateAuction,
} from "@/lib/server/auctions";
import type { CreateAuctionWithVehicleInput } from "@/types";
import { revalidatePath } from "next/cache";

export async function createAuctionWithVehicleAction(
  input: CreateAuctionWithVehicleInput,
) {
  const result = await createAuctionWithVehicle(input);

  if (result.success) {
    revalidatePath("/admin/auctions");
  }

  return result;
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
