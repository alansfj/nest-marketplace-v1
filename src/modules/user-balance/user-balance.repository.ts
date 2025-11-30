import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBalance } from 'src/entities/user-balance.entity';
import { IUserBalanceRepository } from 'src/types/user-balance/user-balance.repository.interface';
import { Repository } from 'typeorm';

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

  async save(userBalance: UserBalance): Promise<UserBalance> {
    return await this.repo.save(userBalance);
  }
}
