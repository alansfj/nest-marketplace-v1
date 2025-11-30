import { User, UserSelectableColumns } from 'src/entities/user.entity';
import { PrimitiveColumns } from '../selectable-columns.type';

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

  abstract findOneEqualBy<T extends UserSelectableColumns>(
    options: Partial<Record<UserSelectableColumns, PrimitiveColumns>>,
    select?: T[],
  ): Promise<Pick<User, T> | null>;
}
