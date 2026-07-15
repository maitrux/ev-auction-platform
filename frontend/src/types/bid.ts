export type AuctionStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "LIVE"
  | "ENDED"
  | "CANCELLED";

export interface Bid {
  id: string;
  amount: number;
  createdAt: string;
  auction: {
    id: string;
    status: AuctionStatus;
    startsAt: string | null;
    endsAt: string | null;
    vehicle: {
      make: string;
      model: string;
      year: number;
    };
  };
}
