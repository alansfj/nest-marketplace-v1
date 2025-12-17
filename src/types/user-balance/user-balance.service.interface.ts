import { UserBalance } from 'src/entities/user-balance.entity';
import { User } from 'src/entities/user.entity';

export abstract class IUserBalanceService {
  abstract createForNewUser(user: User): Promise<UserBalance>;

  abstract increaseUserBalance(
    userId: number,
    quantity: number,
  ): Promise<UserBalance>;
}
