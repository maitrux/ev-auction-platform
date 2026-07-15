import { AuctionResult } from 'src/common/constants/auction-result';
import { DealerAuctionOutcome } from 'src/common/constants/dealer-auction-outcome';
import { AuctionStatus } from 'src/common/constants/auction-status';
import {
  didDealerWinBid,
  getDealerAuctionOutcome,
} from './dealer-auction-outcome';

describe('dealer-auction-outcome', () => {
  describe('getDealerAuctionOutcome', () => {
    it('returns null for non-ended auctions', () => {
      expect(
        getDealerAuctionOutcome(AuctionStatus.LIVE, null),
      ).toBeNull();
    });

    it('returns PENDING when ended without a stored result', () => {
      expect(
        getDealerAuctionOutcome(AuctionStatus.ENDED, null),
      ).toBe(DealerAuctionOutcome.PENDING);
    });

    it('returns RESOLVED when sold or unsold', () => {
      expect(
        getDealerAuctionOutcome(AuctionStatus.ENDED, AuctionResult.SOLD),
      ).toBe(DealerAuctionOutcome.RESOLVED);
      expect(
        getDealerAuctionOutcome(AuctionStatus.ENDED, AuctionResult.UNSOLD),
      ).toBe(DealerAuctionOutcome.RESOLVED);
    });
  });

  describe('didDealerWinBid', () => {
    it('returns true only for the confirmed winning bid', () => {
      expect(
        didDealerWinBid('bid-1', 'bid-1', AuctionResult.SOLD),
      ).toBe(true);
    });

    it('returns false when the auction was not sold', () => {
      expect(
        didDealerWinBid('bid-1', 'bid-1', AuctionResult.UNSOLD),
      ).toBe(false);
    });

    it('returns false for non-winning bids', () => {
      expect(
        didDealerWinBid('bid-2', 'bid-1', AuctionResult.SOLD),
      ).toBe(false);
    });
  });
});
