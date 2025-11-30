import { User, UserSelectableColumns } from 'src/entities/user.entity';
import { RegisterDtoInput } from 'src/modules/auth/dtos/register/register.dto.input';

export abstract class IUserService {
  abstract findOneById(
    id: number,
    select?: UserSelectableColumns[],
  ): Promise<User | null>;

  abstract findOneByEmail(email: string): Promise<User | null>;

  abstract registerUser(dto: RegisterDtoInput): Promise<User>;
}
