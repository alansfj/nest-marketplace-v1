import {
  UserBalance,
  UserBalanceSelectableColumns,
} from 'src/entities/user-balance.entity';

export abstract class IUserBalanceRepository {
  abstract save(userBalance: UserBalance): Promise<UserBalance>;

  abstract findOneByUserId<T extends UserBalanceSelectableColumns>(
    userId: number,
    select?: T[],
  ): Promise<Pick<UserBalance, T> | null>;
}
