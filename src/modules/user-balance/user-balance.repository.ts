import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
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

  private readonly TABLE_ALIAS = 'USER_BALANCE';

  private qb() {
    return this.repo.createQueryBuilder(this.TABLE_ALIAS);
  }

  private qbSelectedColumns(select?: UserBalanceSelectableColumns[]) {
    const qb = this.qb();

    if (select?.length) {
      qb.select(select.map((col) => `${this.TABLE_ALIAS}.${col}`));
    }

    return qb;
  }

  async save(userBalance: UserBalance): Promise<UserBalance> {
    return await this.repo.save(userBalance);
  }
}
