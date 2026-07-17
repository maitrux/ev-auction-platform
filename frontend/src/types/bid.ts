import type { AuctionStatus } from "./auction";
import type { DealerAuctionOutcome } from "./dealer-auction-outcome";

export interface Bid {
  id: string;
  amount: number;
  createdAt: string;
  auction: {
    id: string;
    status: AuctionStatus;
    startsAt: string | null;
    endsAt: string | null;
    outcome: DealerAuctionOutcome | null;
    won: boolean;
    vehicle: {
      make: string;
      model: string;
      year: number;
    };
  };
}
