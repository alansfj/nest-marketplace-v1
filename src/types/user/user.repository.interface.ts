import { User, UserSelectableColumns } from 'src/entities/user.entity';

export abstract class IUserRepository {
  abstract save(user: User): Promise<User>;

  abstract findOneById<T extends UserSelectableColumns>(
    id: number,
    select?: T[],
  ): Promise<Pick<User, T> | null>;

  abstract findOneByEmail<T extends UserSelectableColumns>(
    email: string,
    select?: T[],
  ): Promise<Pick<User, T> | null>;

  abstract findOneBy(options: Partial<User>): Promise<User | null>;
}
