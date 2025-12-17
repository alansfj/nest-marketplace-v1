import { BadRequestException, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { UserBalance } from 'src/entities/user-balance.entity';
import { User } from 'src/entities/user.entity';
import { Currency } from 'src/types/currency.type';
import { IUserBalanceRepository } from 'src/types/user-balance/user-balance.repository.interface';
import { IUserBalanceService } from 'src/types/user-balance/user-balance.service.interface';

@Injectable()
export class UserBalanceService implements IUserBalanceService {
  constructor(private readonly userBalanceRepository: IUserBalanceRepository) {}

  @Transactional()
  async createForNewUser(user: User): Promise<UserBalance> {
    const newUserBalanceEntity = UserBalance.create({
      user,
      balance: 0,
      currency: Currency.MXN,
    });

    return await this.userBalanceRepository.save(newUserBalanceEntity);
  }

  @Transactional()
  async increaseUserBalance(
    userId: number,
    quantity: number,
  ): Promise<UserBalance> {
    const userBalanceEntity =
      await this.userBalanceRepository.findOneByUserIdForUpdate(userId);

    if (!userBalanceEntity) {
      throw new BadRequestException('error getting user balance');
    }

    userBalanceEntity.increaseBalance(quantity);

    return await this.userBalanceRepository.save(userBalanceEntity);
  }
}
