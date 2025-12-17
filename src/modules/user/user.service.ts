import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Transactional } from 'typeorm-transactional';

import { User } from '../../entities/user.entity';
import { RegisterDtoInput } from '../auth/dtos/register/register.dto.input';
import { IUserRepository } from 'src/types/user/user.repository.interface';
import { IUserService } from 'src/types/user/user.service.interface';
import { IUserBalanceService } from 'src/types/user-balance/user-balance.service.interface';
import { IAuthUser } from 'src/types/auth-user.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: IUserRepository,
    private readonly userBalanceService: IUserBalanceService,
  ) {}

  async getUserForPasswordValidation(email: string): Promise<User> {
    const user = await this.userRepository.findOneByEqualReadOnly({ email }, [
      'id',
      'email',
      'password',
      'firstName',
      'lastName',
      'createdDate',
      'updatedDate',
      'deletedDate',
    ]);

    if (user) return user as User;

    throw new BadRequestException('user not found');
  }

  async getAuthorizedUser(id: number): Promise<IAuthUser> {
    const user = await this.userRepository.findOneByEqualReadOnly({ id }, [
      'id',
      'email',
      'firstName',
      'lastName',
    ]);

    if (user) return user;

    throw new UnauthorizedException();
  }

  async getUserFromId(id: number): Promise<User> {
    const user = await this.userRepository.findOneByIdForUpdate(id);

    if (user) return user;

    throw new UnauthorizedException('Unauthorized User');
  }

  @Transactional()
  async registerNewUser(registerDto: RegisterDtoInput): Promise<User> {
    const userExists = await this.userRepository.existsByEqual({
      email: registerDto.email,
    });

    if (userExists) {
      throw new BadRequestException('User with that email already exists');
    }

    const { password, ...rest } = registerDto;

    const hashedPassword = await bcrypt.hash(
      password,
      this.configService.get<number>('SALT_ROUNDS')!,
    );

    const newUserEntity = User.create({
      ...rest,
      password: hashedPassword,
    });

    const newUser = await this.userRepository.save(newUserEntity);

    await this.userBalanceService.createForNewUser(newUser);

    return newUser;
  }
}
