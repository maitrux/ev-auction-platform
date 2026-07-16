import { getBidAmountError, getMinNextBid } from './bid-validation';

describe('bid-validation', () => {
  describe('getMinNextBid', () => {
    it('returns minIncrement when there are no bids', () => {
      expect(getMinNextBid([], 250)).toBe(250);
    });

    it('returns highest bid plus minIncrement when bids exist', () => {
      const bids = [
        { amount: 26900, createdAt: new Date('2026-07-14T10:00:00.000Z') },
        { amount: 27250, createdAt: new Date('2026-07-14T11:00:00.000Z') },
      ];

      expect(getMinNextBid(bids, 250)).toBe(27500);
    });

    it('returns null when minIncrement is missing', () => {
      expect(getMinNextBid([], null)).toBeNull();
    });
  });

  describe('getBidAmountError', () => {
    it('returns null for a valid first bid', () => {
      expect(getBidAmountError(250, [], 250)).toBeNull();
    });

    it('returns an error when the bid is below the minimum', () => {
      const bids = [
        { amount: 27250, createdAt: new Date('2026-07-14T11:00:00.000Z') },
      ];

      expect(getBidAmountError(27400, bids, 250)).toBe(
        'Bid must be at least €27,500',
      );
    });

    it('returns an error when the auction cannot accept bids', () => {
      expect(getBidAmountError(250, [], null)).toBe(
        'This auction is not accepting bids',
      );
    });
  });
});
