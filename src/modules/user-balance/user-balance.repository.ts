import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import {
  TABLE_ALIAS_USER_BALANCE,
  UserBalance,
  UserBalanceSelectableColumns,
} from 'src/entities/user-balance.entity';
import { IUserBalanceRepository } from 'src/types/user-balance/user-balance.repository.interface';

@Injectable()
export class UserBalanceTypeormRepository implements IUserBalanceRepository {
  constructor(
    @InjectRepository(UserBalance)
    private repo: Repository<UserBalance>,
  ) {}

  private qb() {
    return this.repo.createQueryBuilder(TABLE_ALIAS_USER_BALANCE);
  }

  private qbSelectedColumns(select: UserBalanceSelectableColumns[]) {
    const qb = this.qb();

    qb.select(select.map((col) => `${TABLE_ALIAS_USER_BALANCE}.${col}`));

    return qb;
  }

  save: IUserBalanceRepository['save'] = async (userBalance) => {
    return await this.repo.save(userBalance);
  };

  private findOneByUserId(qb: SelectQueryBuilder<UserBalance>, userId: number) {
    return qb
      .where(`${TABLE_ALIAS_USER_BALANCE}.userId = :userId`, { userId })
      .getOne();
  }

  async findOneByUserIdReadOnly<T extends UserBalanceSelectableColumns>(
    userId: number,
    select: T[],
  ): Promise<Pick<UserBalance, T> | null> {
    const qb = this.qbSelectedColumns(select);

    return this.findOneByUserId(qb, userId);
  }

  async findOneByUserIdForUpdate(userId: number): Promise<UserBalance | null> {
    const qb = this.qb().setLock('pessimistic_write');

    return this.findOneByUserId(qb, userId);
  }
}
