import { User } from 'src/entities/user.entity';
import { RegisterDtoInput } from 'src/modules/auth/dtos/register/register.dto.input';

export abstract class IUserService {
  abstract getUserForPasswordValidation(email: string): Promise<User>;

  abstract getAuthorizedUser(id: number): Promise<User>;

  abstract registerNewUser(dto: RegisterDtoInput): Promise<User>;
}
