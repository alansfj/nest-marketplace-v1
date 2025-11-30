import { User, UserSelectableColumns } from 'src/entities/user.entity';
import { RegisterDtoInput } from 'src/modules/auth/dtos/register/register.dto.input';

export abstract class IUserService {
  abstract findOneById<T extends UserSelectableColumns>(
    id: number,
    select?: T[],
  ): Promise<Pick<User, T> | null>;

  abstract findOneByEmail(email: string): Promise<User | null>;

  abstract registerUser(dto: RegisterDtoInput): Promise<User>;
}
