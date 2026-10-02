import { BadRequestException } from '@nestjs/common';

import { Currency } from 'src/types/currency.type';
import { IUserBalanceRepository } from 'src/types/user-balance/user-balance.repository.interface';
import { User } from 'src/entities/user.entity';
import { UserBalance } from 'src/entities/user-balance.entity';

// createForNewUser/increaseUserBalance are decorated with @Transactional(),
// which needs a real, initialized DataSource. See order.service.spec.ts for
// why this is mocked as a pass-through here.
jest.mock('typeorm-transactional', () => ({
  ...jest.requireActual('typeorm-transactional'),
  Transactional:
    () => (_target: unknown, _key: string, descriptor: PropertyDescriptor) =>
      descriptor,
}));

import { UserBalanceService } from './user-balance.service';

function buildUserBalance(balance = '0.00'): UserBalance {
  // Built through UserBalance.create() (not a plain object literal) because
  // the service calls the real increaseBalance() prototype method on it.
  const userBalance = UserBalance.create({
    user: { __brand: 'User', id: 1 } as unknown as User,
    balance: 0,
    currency: Currency.MXN,
  });
  userBalance.balance = balance;

  return userBalance;
}

describe('UserBalanceService', () => {
  let repository: jest.Mocked<IUserBalanceRepository>;
  let service: UserBalanceService;

  beforeEach(() => {
    repository = {
      findOneByUserIdForUpdate: jest.fn(),
      save: jest.fn((entity) => Promise.resolve(entity)),
    } as unknown as jest.Mocked<IUserBalanceRepository>;

    service = new UserBalanceService(repository);
  });

  describe('createForNewUser', () => {
    it('creates a zero balance in MXN for the given user', async () => {
      const user = { __brand: 'User', id: 1 } as unknown as User;

      const result = await service.createForNewUser(user);

      expect(result.balance).toBe(0);
      expect(result.currency).toBe(Currency.MXN);
      expect(result.user).toBe(user);
      expect(repository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('increaseUserBalance', () => {
    it('increases the balance and saves it', async () => {
      const userBalance = buildUserBalance('50.00');
      repository.findOneByUserIdForUpdate.mockResolvedValue(userBalance);

      const result = await service.increaseUserBalance(1, 25);

      expect(result.balance).toBe('75.00');
      expect(repository.save).toHaveBeenCalledWith(userBalance);
    });

    it('throws when the user has no balance record', async () => {
      repository.findOneByUserIdForUpdate.mockResolvedValue(null);

      await expect(service.increaseUserBalance(999, 25)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.save).not.toHaveBeenCalled();
    });
  });
});
