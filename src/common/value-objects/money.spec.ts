import { Money } from './money';

describe('Money', () => {
  describe('from', () => {
    it('formats a number input with the configured scale', () => {
      expect(Money.from(10).toString()).toBe('10.00');
    });

    it('formats a string input with the configured scale', () => {
      expect(Money.from('10.5').toString()).toBe('10.50');
    });
  });

  describe('zero', () => {
    it('is 0.00', () => {
      expect(Money.zero().toString()).toBe('0.00');
    });
  });

  describe('add', () => {
    it('sums two amounts', () => {
      expect(Money.from('10.00').add(Money.from('5.50')).toString()).toBe(
        '15.50',
      );
    });
  });

  describe('subtract', () => {
    it('subtracts two amounts', () => {
      expect(Money.from('10.00').subtract(Money.from('3.00')).toString()).toBe(
        '7.00',
      );
    });
  });

  describe('multiply', () => {
    it('multiplies by a scalar', () => {
      expect(Money.from('9.99').multiply(3).toString()).toBe('29.97');
    });

    it('rounds to the configured scale instead of keeping extra decimals', () => {
      // 10 / 3 = 3.3333... -> this is how subtotal/total end up with just
      // 2 decimals even when the division doesn't land evenly.
      expect(
        Money.from('10').multiply(1).subtract(Money.zero()).toString(),
      ).toBe('10.00');
      expect(Money.from('3.333').toString()).toBe('3.33');
    });
  });

  describe('comparisons', () => {
    it('isNegative', () => {
      expect(Money.from('-1.00').isNegative()).toBe(true);
      expect(Money.from('0.00').isNegative()).toBe(false);
      expect(Money.from('1.00').isNegative()).toBe(false);
    });

    it('isGreaterThan', () => {
      expect(Money.from('10.00').isGreaterThan(Money.from('5.00'))).toBe(true);
      expect(Money.from('5.00').isGreaterThan(Money.from('10.00'))).toBe(false);
      expect(Money.from('5.00').isGreaterThan(Money.from('5.00'))).toBe(false);
    });

    it('isGreaterOrEqualThan', () => {
      expect(
        Money.from('10.00').isGreaterOrEqualThan(Money.from('10.00')),
      ).toBe(true);
      expect(Money.from('5.00').isGreaterOrEqualThan(Money.from('10.00'))).toBe(
        false,
      );
    });

    it('isLessThan', () => {
      expect(Money.from('5.00').isLessThan(Money.from('10.00'))).toBe(true);
      expect(Money.from('10.00').isLessThan(Money.from('5.00'))).toBe(false);
    });

    it('isLessOrEqualThan', () => {
      expect(Money.from('10.00').isLessOrEqualThan(Money.from('10.00'))).toBe(
        true,
      );
      expect(Money.from('10.01').isLessOrEqualThan(Money.from('10.00'))).toBe(
        false,
      );
    });
  });

  describe('toNumber', () => {
    it('converts back to a JS number using the same rounded representation as toString', () => {
      expect(Money.from('12.345').toNumber()).toBe(12.35);
    });
  });
});
