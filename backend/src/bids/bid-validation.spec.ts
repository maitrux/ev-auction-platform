import { getBidAmountError, getMinNextBid } from './bid-validation';

const dealerA = 'dealer-a';
const dealerB = 'dealer-b';

describe('bid-validation', () => {
  describe('getMinNextBid', () => {
    it('returns minIncrement when the dealer has no bids', () => {
      expect(getMinNextBid([], 250, dealerA)).toBe(250);
    });

    it('returns minIncrement when other dealers have bids but this dealer does not', () => {
      const bids = [
        {
          amount: 26900,
          createdAt: new Date('2026-07-14T10:00:00.000Z'),
          dealerId: dealerB,
        },
        {
          amount: 27250,
          createdAt: new Date('2026-07-14T11:00:00.000Z'),
          dealerId: dealerB,
        },
      ];

      expect(getMinNextBid(bids, 250, dealerA)).toBe(250);
    });

    it('returns the dealer highest bid plus minIncrement when they already have bids', () => {
      const bids = [
        {
          amount: 26900,
          createdAt: new Date('2026-07-14T10:00:00.000Z'),
          dealerId: dealerA,
        },
        {
          amount: 27250,
          createdAt: new Date('2026-07-14T11:00:00.000Z'),
          dealerId: dealerB,
        },
      ];

      expect(getMinNextBid(bids, 250, dealerA)).toBe(27150);
    });

    it('returns null when minIncrement is missing', () => {
      expect(getMinNextBid([], null, dealerA)).toBeNull();
    });
  });

  describe('getBidAmountError', () => {
    it('returns null for a valid first bid', () => {
      expect(getBidAmountError(250, [], 250, dealerA)).toBeNull();
    });

    it('allows a dealer first bid below another dealer highest bid', () => {
      const bids = [
        {
          amount: 27250,
          createdAt: new Date('2026-07-14T11:00:00.000Z'),
          dealerId: dealerB,
        },
      ];

      expect(getBidAmountError(5000, bids, 250, dealerA)).toBeNull();
    });

    it('returns an error when the bid is below the dealer minimum', () => {
      const bids = [
        {
          amount: 26900,
          createdAt: new Date('2026-07-14T10:00:00.000Z'),
          dealerId: dealerA,
        },
      ];

      expect(getBidAmountError(27000, bids, 250, dealerA)).toBe(
        'Bid must be at least €27,150',
      );
    });

    it('accepts a bid raised from the dealer own highest bid', () => {
      const bids = [
        {
          amount: 26900,
          createdAt: new Date('2026-07-14T10:00:00.000Z'),
          dealerId: dealerA,
        },
        {
          amount: 27250,
          createdAt: new Date('2026-07-14T11:00:00.000Z'),
          dealerId: dealerB,
        },
      ];

      expect(getBidAmountError(27150, bids, 250, dealerA)).toBeNull();
    });

    it('returns an error when the auction cannot accept bids', () => {
      expect(getBidAmountError(250, [], null, dealerA)).toBe(
        'This auction is not accepting bids',
      );
    });
  });
});
