import {
  UserBalance,
  UserBalanceSelectableColumns,
} from 'src/entities/user-balance.entity';
import { IBaseTypeormRepository } from '../base-typeorm.repository.interface';

export abstract class IUserBalanceRepository extends IBaseTypeormRepository<UserBalance> {
  abstract findOneByUserIdForUpdate(
    userId: number,
  ): Promise<UserBalance | null>;

  abstract findOneByUserIdReadOnly<T extends UserBalanceSelectableColumns>(
    userId: number,
    select: T[],
  ): Promise<Pick<UserBalance, T> | null>;
}
