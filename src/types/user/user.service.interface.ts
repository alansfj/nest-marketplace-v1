import { User } from 'src/entities/user.entity';
import { RegisterDtoInput } from 'src/modules/auth/dtos/register/register.dto.input';
import { IAuthUser } from '../auth-user.interface';

export abstract class IUserService {
  abstract getUserForPasswordValidation(email: string): Promise<User>;

  abstract getAuthorizedUser(id: number): Promise<IAuthUser>;

  abstract getUserFromId(id: number): Promise<User>;

  abstract registerNewUser(dto: RegisterDtoInput): Promise<User>;
}
