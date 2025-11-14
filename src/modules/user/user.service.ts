import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../../entities/user.entity';
import { RegisterDtoInput } from '../auth/dtos/register/register.dto.input';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  private qb(alias = 'user') {
    return this.usersRepository.createQueryBuilder(alias);
  }

  async create(registerDto: RegisterDtoInput): Promise<User> {
    const { password, ...rest } = registerDto;

    const hashedPassword = await bcrypt.hash(
      password,
      this.configService.get<number>('SALT_ROUNDS'),
    );

    const newUser = this.usersRepository.create({
      ...rest,
      password: hashedPassword,
    });

    return await this.usersRepository.save(newUser);
  }

  async findOneById(id: number): Promise<User | null> {
    return await this.qb().where('user.id = :id', { id }).getOne();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.qb().where('user.email = :email', { email }).getOne();
  }

  async findOneBy(options: Partial<User>): Promise<User | null> {
    const qb = this.qb();

    Object.entries(options).forEach(([key, value]) => {
      qb.andWhere(`user.${key} = :${key}`, { [key]: value });
    });

    return await qb.getOne();
  }
}
