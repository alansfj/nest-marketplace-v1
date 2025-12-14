import {
  UserBalance,
  UserBalanceSelectableColumns,
} from 'src/entities/user-balance.entity';

export abstract class IUserBalanceRepository {
  abstract save(userBalance: UserBalance): Promise<UserBalance>;

  abstract findOneByUserIdForUpdate(
    userId: number,
  ): Promise<UserBalance | null>;

  abstract findOneByUserIdReadOnly<T extends UserBalanceSelectableColumns>(
    userId: number,
    select: T[],
  ): Promise<Pick<UserBalance, T> | null>;
}
