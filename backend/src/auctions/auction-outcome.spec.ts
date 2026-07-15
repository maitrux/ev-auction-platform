import { AuctionOutcome } from 'src/common/constants/auction-outcome';
import { AuctionResult } from 'src/common/constants/auction-result';
import { AuctionStatus } from 'src/common/constants/auction-status';
import {
  findHighestBid,
  getAcceptOutcomeError,
  getAuctionOutcome,
} from './auction-outcome';

describe('auction-outcome', () => {
  describe('getAuctionOutcome', () => {
    it('returns null when the auction is not ended', () => {
      expect(
        getAuctionOutcome(AuctionStatus.LIVE, null),
      ).toBeNull();
    });

    it('returns PENDING when ended without a stored result', () => {
      expect(
        getAuctionOutcome(AuctionStatus.ENDED, null),
      ).toBe(AuctionOutcome.PENDING);
    });

    it('returns SOLD or UNSOLD when ended with a stored result', () => {
      expect(
        getAuctionOutcome(AuctionStatus.ENDED, AuctionResult.SOLD),
      ).toBe(AuctionOutcome.SOLD);
      expect(
        getAuctionOutcome(AuctionStatus.ENDED, AuctionResult.UNSOLD),
      ).toBe(AuctionOutcome.UNSOLD);
    });
  });

  describe('findHighestBid', () => {
    it('returns the highest bid and breaks ties by earliest bid', () => {
      const highest = findHighestBid([
        {
          id: 'bid-2',
          amount: 20000,
          createdAt: new Date('2026-07-10T12:00:00.000Z'),
        },
        {
          id: 'bid-1',
          amount: 20000,
          createdAt: new Date('2026-07-10T10:00:00.000Z'),
        },
        {
          id: 'bid-3',
          amount: 18000,
          createdAt: new Date('2026-07-10T11:00:00.000Z'),
        },
      ]);

      expect(highest?.id).toBe('bid-1');
    });
  });

  describe('getAcceptOutcomeError', () => {
    const bids = [
      {
        id: 'bid-1',
        amount: 15000,
        createdAt: new Date('2026-07-10T10:00:00.000Z'),
      },
    ];

    it('requires bids', () => {
      expect(getAcceptOutcomeError(15000, [])).toBe(
        'Cannot accept an auction with no bids',
      );
    });

    it('requires the highest bid to meet the reserve', () => {
      expect(getAcceptOutcomeError(16000, bids)).toBe(
        'Highest bid must meet or exceed the reserve price',
      );
    });

    it('returns null when the highest bid meets the reserve', () => {
      expect(getAcceptOutcomeError(15000, bids)).toBeNull();
    });
  });
});
