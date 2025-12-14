import Decimal from 'decimal.js';

import { MONEY_SCALE } from '../constants/money-scale';

export class Money {
  private readonly value: Decimal;

  private static readonly SCALE = MONEY_SCALE;

  private constructor(value: Decimal) {
    this.value = value;
  }

  static from(value: string | number | Decimal): Money {
    return new Money(new Decimal(value));
  }

  static zero(): Money {
    return new Money(new Decimal(0));
  }

  add(amount: Money): Money {
    return new Money(this.value.plus(amount.value));
  }

  subtract(amount: Money): Money {
    return new Money(this.value.minus(amount.value));
  }

  isNegative(): boolean {
    return this.value.isNegative();
  }

  isGreaterThan(amount: Money): boolean {
    return this.value.gt(amount.value);
  }

  isGreaterOrEqualThan(amount: Money): boolean {
    return this.value.gte(amount.value);
  }

  isLessThan(amount: Money): boolean {
    return this.value.lt(amount.value);
  }

  isLessOrEqualThan(amount: Money): boolean {
    return this.value.lte(amount.value);
  }

  toString(): string {
    return this.value.toFixed(Money.SCALE);
  }

  toNumber(): number {
    return Number(this.toString());
  }
}
