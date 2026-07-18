import { findHighestBid } from '../auctions/auction-outcome';

type BidForValidation = {
  amount: number;
  createdAt: Date;
  dealerId: string;
};

export function getMinNextBid(
  bids: BidForValidation[],
  minIncrement: number | null,
  dealerId: string,
): number | null {
  if (minIncrement == null) {
    return null;
  }

  const myHighestBid = findHighestBid(
    bids.filter((bid) => bid.dealerId === dealerId),
  );

  if (myHighestBid) {
    return myHighestBid.amount + minIncrement;
  }

  return minIncrement;
}

export function getBidAmountError(
  amount: number,
  bids: BidForValidation[],
  minIncrement: number | null,
  dealerId: string,
): string | null {
  const minNextBid = getMinNextBid(bids, minIncrement, dealerId);

  if (minNextBid == null) {
    return 'This auction is not accepting bids';
  }

  if (amount < minNextBid) {
    return `Bid must be at least €${minNextBid.toLocaleString('en-GB')}`;
  }

  return null;
}
