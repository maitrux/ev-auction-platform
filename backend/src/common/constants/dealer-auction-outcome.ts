export const DealerAuctionOutcome = {
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
} as const;

export type DealerAuctionOutcome =
  (typeof DealerAuctionOutcome)[keyof typeof DealerAuctionOutcome];
