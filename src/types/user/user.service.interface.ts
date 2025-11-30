import { User, UserSelectableColumns } from 'src/entities/user.entity';
import { RegisterDtoInput } from 'src/modules/auth/dtos/register/register.dto.input';

export abstract class IUserService {
  abstract findOneById<T extends UserSelectableColumns>(
    id: number,
    select?: T[],
  ): Promise<Pick<User, T> | null>;

  abstract findOneByEmail<T extends UserSelectableColumns>(
    email: string,
    select?: T[],
  ): Promise<Pick<User, T> | null>;

  abstract registerUser(dto: RegisterDtoInput): Promise<User>;
}
