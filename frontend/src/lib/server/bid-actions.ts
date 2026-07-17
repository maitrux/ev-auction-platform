"use server";

import { placeBid } from "@/lib/server/bids";
import { revalidatePath } from "next/cache";

export async function placeBidAction(auctionId: string, amount: number) {
  const result = await placeBid(auctionId, amount);

  if (result.success) {
    revalidatePath(`/dealer/auctions/${auctionId}`);
    revalidatePath("/dealer/bids");
    revalidatePath("/dealer/auctions");
  }

  return result;
}
