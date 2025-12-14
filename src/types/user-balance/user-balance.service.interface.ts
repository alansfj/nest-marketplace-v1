import { UserBalance } from 'src/entities/user-balance.entity';
import { User } from 'src/entities/user.entity';

export abstract class IUserBalanceService {
  abstract createForNewUser(user: User): Promise<UserBalance>;

  abstract increaseUserBalance(
    user: User,
    quantity: number,
  ): Promise<UserBalance>;
}
