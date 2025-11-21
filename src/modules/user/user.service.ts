import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from '../../entities/user.entity';
import { RegisterDtoInput } from '../auth/dtos/register/register.dto.input';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(registerDto: RegisterDtoInput): Promise<User> {
    const { password, ...rest } = registerDto;

    const hashedPassword = await bcrypt.hash(
      password,
      this.configService.get<number>('SALT_ROUNDS'),
    );

    const newUser = this.userRepository.create({
      ...rest,
      password: hashedPassword,
    });

    return await this.userRepository.save(newUser);
  }
}
