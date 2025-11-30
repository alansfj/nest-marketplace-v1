import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserSelectableColumns } from 'src/entities/user.entity';
import { IUserRepository } from 'src/types/user/user.repository.interface';
import { Repository } from 'typeorm';

@Injectable()
export class UserTypeormRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  private readonly TABLE_ALIAS = 'USER';

  private qb() {
    return this.repo.createQueryBuilder(this.TABLE_ALIAS);
  }

  private qbSelectedColumns(select?: UserSelectableColumns[]) {
    const qb = this.qb();

    if (select?.length) {
      qb.select(select.map((col) => `${this.TABLE_ALIAS}.${col}`));
    }

    return qb;
  }

  async save(user: User): Promise<User> {
    return await this.repo.save(user);
  }

  async findOneById<T extends UserSelectableColumns>(
    id: number,
    select?: T[],
  ): Promise<Pick<User, T> | null> {
    const qb = this.qbSelectedColumns(select);

    return await qb.where(`${this.TABLE_ALIAS}.id = :id`, { id }).getOne();
  }

  async findOneByEmail<T extends UserSelectableColumns>(
    email: string,
    select?: T[],
  ): Promise<Pick<User, T> | null> {
    const qb = this.qbSelectedColumns(select);

    return await qb
      .where(`${this.TABLE_ALIAS}.email = :email`, { email })
      .getOne();
  }

  async findOneBy(options: Partial<User>): Promise<User | null> {
    const qb = this.qb();

    Object.entries(options).forEach(([key, value]) => {
      qb.andWhere(`${this.TABLE_ALIAS}.${key} = :${key}`, { [key]: value });
    });

    return await qb.getOne();
  }
}
