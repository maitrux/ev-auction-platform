export const AuctionStatus = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  LIVE: 'LIVE',
  ENDED: 'ENDED',
  CANCELED: 'CANCELED',
} as const;

export type AuctionStatus = (typeof AuctionStatus)[keyof typeof AuctionStatus];
