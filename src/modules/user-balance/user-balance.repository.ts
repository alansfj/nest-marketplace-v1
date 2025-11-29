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

  private qb(alias = 'userBalance') {
    return this.repo.createQueryBuilder(alias);
  }

  async save(userBalance: UserBalance): Promise<UserBalance> {
    return await this.repo.save(userBalance);
  }
}
