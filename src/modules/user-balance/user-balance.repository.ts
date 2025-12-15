import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import {
  TABLE_ALIAS_USER_BALANCE,
  UserBalance,
  UserBalanceSelectableColumns,
} from 'src/entities/user-balance.entity';
import { IUserBalanceRepository } from 'src/types/user-balance/user-balance.repository.interface';
import { BaseTypeormRepository } from 'src/common/repositories/base-typeorm.repository';

@Injectable()
export class UserBalanceTypeormRepository
  extends BaseTypeormRepository<UserBalance>
  implements IUserBalanceRepository
{
  constructor(
    @InjectRepository(UserBalance)
    repo: Repository<UserBalance>,
  ) {
    super(repo);
  }

  private findOneByUserId(qb: SelectQueryBuilder<UserBalance>, userId: number) {
    return qb
      .where(`${TABLE_ALIAS_USER_BALANCE}.userId = :userId`, { userId })
      .getOne();
  }

  // ForUpdate

  async findOneByUserIdForUpdate(userId: number): Promise<UserBalance | null> {
    const qb = this.qb().setLock('pessimistic_write');

    return this.findOneByUserId(qb, userId);
  }

  // ReadOnly

  async findOneByUserIdReadOnly<T extends UserBalanceSelectableColumns>(
    userId: number,
    select: T[],
  ): Promise<Pick<UserBalance, T> | null> {
    const qb = this.qbSelectedColumns(select);

    return this.findOneByUserId(qb, userId);
  }
}
