import { BadRequestException, Injectable } from '@nestjs/common';
import { UserBalance } from 'src/entities/user-balance.entity';
import { User } from 'src/entities/user.entity';
import { Currency } from 'src/types/currency.type';
import { IUserBalanceRepository } from 'src/types/user-balance/user-balance.repository.interface';
import { IUserBalanceService } from 'src/types/user-balance/user-balance.service.interface';

@Injectable()
export class UserBalanceService implements IUserBalanceService {
  constructor(private readonly userBalanceRepository: IUserBalanceRepository) {}

  async createForNewUser(user: User): Promise<UserBalance> {
    const newUserBalanceEntity = UserBalance.create({
      user,
      balance: 0,
      currency: Currency.MXN,
    });

    if (newUserBalanceEntity.error) {
      throw new BadRequestException(newUserBalanceEntity.error);
    }

    return await this.userBalanceRepository.save(newUserBalanceEntity.value);
  }
}
