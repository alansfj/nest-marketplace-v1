import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, UserSelectableColumns } from 'src/entities/user.entity';
import { IUserRepository } from 'src/types/user/user.repository.interface';

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

  save: IUserRepository['save'] = async (user) => {
    return await this.repo.save(user);
  };

  findOneById: IUserRepository['findOneById'] = async (id, select?) => {
    const qb = this.qbSelectedColumns(select);

    return qb.where(`${this.TABLE_ALIAS}.id = :id`, { id }).getOne();
  };

  findOneByEmail: IUserRepository['findOneByEmail'] = async (
    email,
    select?,
  ) => {
    const qb = this.qbSelectedColumns(select);

    return await qb
      .where(`${this.TABLE_ALIAS}.email = :email`, { email })
      .getOne();
  };

  findOneEqualBy: IUserRepository['findOneEqualBy'] = async (
    options,
    select?,
  ) => {
    const qb = this.qbSelectedColumns(select);

    Object.entries(options).forEach(([key, value]) => {
      qb.andWhere(`${this.TABLE_ALIAS}.${key} = :${key}`, { [key]: value });
    });

    return await qb.getOne();
  };
}
