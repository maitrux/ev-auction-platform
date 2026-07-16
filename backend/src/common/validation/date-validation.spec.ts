import { getCurrentYear, isDateInFuture, isInPast } from './date-validation';

describe('date-validation', () => {
  const now = new Date('2026-07-16T12:00:00.000Z');

  describe('isInPast', () => {
    it('returns true for dates before now', () => {
      expect(isInPast(new Date('2026-07-16T11:59:59.000Z'), now)).toBe(true);
    });

    it('returns false for the current time and future dates', () => {
      expect(isInPast(now, now)).toBe(false);
      expect(isInPast(new Date('2026-07-16T12:00:01.000Z'), now)).toBe(false);
    });
  });

  describe('isDateInFuture', () => {
    it('returns true for dates after today', () => {
      expect(isDateInFuture(new Date('2026-07-17T00:00:00.000Z'), now)).toBe(
        true,
      );
    });

    it('returns false for today and earlier dates', () => {
      expect(isDateInFuture(new Date('2026-07-16T23:59:59.000Z'), now)).toBe(
        false,
      );
      expect(isDateInFuture(new Date('2026-07-15T00:00:00.000Z'), now)).toBe(
        false,
      );
    });
  });

  describe('getCurrentYear', () => {
    it('returns the year from the provided date', () => {
      expect(getCurrentYear(now)).toBe(2026);
    });
  });
});
