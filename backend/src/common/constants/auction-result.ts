export const AuctionResult = {
  SOLD: 'SOLD',
  UNSOLD: 'UNSOLD',
} as const;

export type AuctionResult = (typeof AuctionResult)[keyof typeof AuctionResult];
