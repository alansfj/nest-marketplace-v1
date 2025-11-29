import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { IUserRepository } from 'src/types/user/user.repository.interface';
import { Repository } from 'typeorm';

@Injectable()
export class UserTypeormRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  private qb(alias = 'user') {
    return this.repo.createQueryBuilder(alias);
  }

  async save(user: User): Promise<User> {
    return await this.repo.save(user);
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
