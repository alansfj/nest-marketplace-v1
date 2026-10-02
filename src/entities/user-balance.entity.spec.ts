import { EntityValidationException } from 'src/common/exceptions/entity-validation.exception';
import { Currency } from 'src/types/currency.type';
import { User } from './user.entity';
import { UserBalance } from './user-balance.entity';

const user = { __brand: 'User', id: 1 } as unknown as User;

const validDto = {
  user,
  balance: 0,
  currency: Currency.MXN,
};

describe('UserBalance.create', () => {
  it('creates a user balance from a valid dto', () => {
    const userBalance = UserBalance.create(validDto);

    expect(userBalance.balance).toBe(0);
    expect(userBalance.currency).toBe(Currency.MXN);
    expect(userBalance.user).toBe(user);
  });

  it.each([
    ['balance is negative', { balance: -1 }],
    ['currency is not a valid Currency', { currency: 'EUR' }],
  ])('rejects a dto where %s', (_description, overrides) => {
    expect(() =>
      UserBalance.create({ ...validDto, ...overrides } as any),
    ).toThrow(EntityValidationException);
  });
});

describe('UserBalance.increaseBalance', () => {
  it('adds the quantity to the current balance', () => {
    const userBalance = UserBalance.create(validDto);
    userBalance.balance = '50.00';

    userBalance.increaseBalance(25);

    expect(userBalance.balance).toBe('75.00');
  });

  it('accepts a string quantity', () => {
    const userBalance = UserBalance.create(validDto);
    userBalance.balance = '10.00';

    userBalance.increaseBalance('5.50');

    expect(userBalance.balance).toBe('15.50');
  });

  it('rejects a negative quantity', () => {
    const userBalance = UserBalance.create(validDto);
    userBalance.balance = '50.00';

    expect(() => userBalance.increaseBalance(-10)).toThrow(
      'Cannot increase balance with negative amount',
    );
    expect(userBalance.balance).toBe('50.00');
  });
});
