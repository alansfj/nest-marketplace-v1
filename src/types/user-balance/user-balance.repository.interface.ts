import { UserBalance } from 'src/entities/user-balance.entity';

export abstract class IUserBalanceRepository {
  abstract save(userBalance: UserBalance): Promise<UserBalance>;
}
