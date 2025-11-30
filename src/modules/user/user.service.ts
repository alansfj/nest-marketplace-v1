import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Transactional } from 'typeorm-transactional';

import { User, UserSelectableColumns } from '../../entities/user.entity';
import { RegisterDtoInput } from '../auth/dtos/register/register.dto.input';
import { ConfigService } from '@nestjs/config';
import { IUserRepository } from 'src/types/user/user.repository.interface';
import { IUserService } from 'src/types/user/user.service.interface';
import { IUserBalanceService } from 'src/types/user-balance/user-balance.service.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: IUserRepository,
    private readonly userBalanceService: IUserBalanceService,
  ) {}

  // methods without logic

  async findOneById<T extends UserSelectableColumns>(
    id: number,
    select?: T[],
  ): Promise<Pick<User, T> | null> {
    return await this.userRepository.findOneById(id, select);
  }

  async findOneByEmail<T extends UserSelectableColumns>(
    email: string,
    select?: T[],
  ): Promise<Pick<User, T> | null> {
    return await this.userRepository.findOneByEmail(email, select);
  }

  // methods with logic

  @Transactional()
  async registerUser(registerDto: RegisterDtoInput): Promise<User> {
    const userExists = await this.findOneByEmail(registerDto.email, ['id']);

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

    if (newUserEntity.errors) {
      throw new BadRequestException(newUserEntity.errors);
    }

    const newUser = await this.userRepository.save(newUserEntity.value);

    await this.userBalanceService.createForNewUser(newUser);

    return newUser;
  }
}
