import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  private qbSelectedColumns(select?: UserBalanceSelectableColumns[]) {
    const qb = this.qb();

    if (select?.length) {
      qb.select(select.map((col) => `${TABLE_ALIAS_USER_BALANCE}.${col}`));
    }

    return qb;
  }

  save: IUserBalanceRepository['save'] = async (userBalance) => {
    return await this.repo.save(userBalance);
  };
}
