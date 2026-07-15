import { AuctionOutcome } from 'src/common/constants/auction-outcome';
import { AuctionResult } from 'src/common/constants/auction-result';
import { AuctionStatus } from 'src/common/constants/auction-status';

type BidForOutcome = {
  id: string;
  amount: number;
  createdAt: Date;
};

export function getAuctionOutcome(
  effectiveStatus: AuctionStatus,
  storedResult: string | null,
): AuctionOutcome | null {
  if (effectiveStatus !== AuctionStatus.ENDED) {
    return null;
  }

  if (storedResult === AuctionResult.SOLD) {
    return AuctionOutcome.SOLD;
  }

  if (storedResult === AuctionResult.UNSOLD) {
    return AuctionOutcome.UNSOLD;
  }

  return AuctionOutcome.PENDING;
}

export function findHighestBid<T extends BidForOutcome>(
  bids: T[],
): T | null {
  if (bids.length === 0) {
    return null;
  }

  return bids.reduce((highest, bid) => {
    if (bid.amount > highest.amount) {
      return bid;
    }

    if (
      bid.amount === highest.amount &&
      bid.createdAt < highest.createdAt
    ) {
      return bid;
    }

    return highest;
  });
}

export function getAcceptOutcomeError(
  reservePrice: number | null,
  bids: BidForOutcome[],
): string | null {
  if (reservePrice == null) {
    return 'Reserve price is required to accept a bid';
  }

  const highestBid = findHighestBid(bids);

  if (!highestBid) {
    return 'Cannot accept an auction with no bids';
  }

  if (highestBid.amount < reservePrice) {
    return 'Highest bid must meet or exceed the reserve price';
  }

  return null;
}
