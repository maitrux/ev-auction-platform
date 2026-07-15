export const AuctionOutcome = {
  PENDING: 'PENDING',
  SOLD: 'SOLD',
  UNSOLD: 'UNSOLD',
} as const;

export type AuctionOutcome =
  (typeof AuctionOutcome)[keyof typeof AuctionOutcome];
