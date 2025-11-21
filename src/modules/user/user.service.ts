import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { User } from '../../entities/user.entity';
import { RegisterDtoInput } from '../auth/dtos/register/register.dto.input';
import { ConfigService } from '@nestjs/config';
import { IUserRepository } from 'src/types/user/user.repository.interface';
import { IUserService } from 'src/types/user/user.service.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly configService: ConfigService,
  ) {}

  // methods without logic

  async findOneById(id: number): Promise<User | null> {
    return await this.userRepository.findOneById(id);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneByEmail(email);
  }

  // methods with logic

  async registerUser(registerDto: RegisterDtoInput): Promise<User> {
    const { password, ...rest } = registerDto;

    const hashedPassword = await bcrypt.hash(
      password,
      this.configService.get<number>('SALT_ROUNDS'),
    );

    const newUser = this.userRepository.createEntity({
      ...rest,
      password: hashedPassword,
    });

    return await this.userRepository.save(newUser);
  }
}
