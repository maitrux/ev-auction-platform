import { AuctionOutcome } from 'src/common/constants/auction-outcome';
import { AuctionResult } from 'src/common/constants/auction-result';
import { AuctionStatus } from 'src/common/constants/auction-status';
import { DealerAuctionOutcome } from 'src/common/constants/dealer-auction-outcome';
import { getAuctionOutcome } from './auction-outcome';

export function getDealerAuctionOutcome(
  effectiveStatus: AuctionStatus,
  storedResult: string | null,
): DealerAuctionOutcome | null {
  const outcome = getAuctionOutcome(effectiveStatus, storedResult);

  if (outcome === null) {
    return null;
  }

  if (outcome === AuctionOutcome.PENDING) {
    return DealerAuctionOutcome.PENDING;
  }

  return DealerAuctionOutcome.RESOLVED;
}

export function didDealerWinBid(
  bidId: string,
  winningBidId: string | null,
  storedResult: string | null,
): boolean {
  return (
    storedResult === AuctionResult.SOLD &&
    winningBidId !== null &&
    winningBidId === bidId
  );
}
