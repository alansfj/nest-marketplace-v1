import { User, UserSelectableColumns } from 'src/entities/user.entity';

export abstract class IUserRepository {
  abstract save(user: User): Promise<User>;

  abstract findOneById(
    id: number,
    select?: UserSelectableColumns[],
  ): Promise<User | null>;

  abstract findOneByEmail(email: string): Promise<User | null>;

  abstract findOneBy(options: Partial<User>): Promise<User | null>;
}
