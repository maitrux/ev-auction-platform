import { findHighestBid } from '../auctions/auction-outcome';

type BidForValidation = {
  amount: number;
  createdAt: Date;
};

export function getMinNextBid(
  bids: BidForValidation[],
  minIncrement: number | null,
): number | null {
  if (minIncrement == null) {
    return null;
  }

  const highestBid = findHighestBid(bids);

  if (!highestBid) {
    return minIncrement;
  }

  return highestBid.amount + minIncrement;
}

export function getBidAmountError(
  amount: number,
  bids: BidForValidation[],
  minIncrement: number | null,
): string | null {
  const minNextBid = getMinNextBid(bids, minIncrement);

  if (minNextBid == null) {
    return 'This auction is not accepting bids';
  }

  if (amount < minNextBid) {
    return `Bid must be at least €${minNextBid.toLocaleString('en-GB')}`;
  }

  return null;
}
