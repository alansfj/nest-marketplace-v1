import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  User,
  TABLE_ALIAS_USER,
  UserSelectableColumns,
} from 'src/entities/user.entity';
import { IUserRepository } from 'src/types/user/user.repository.interface';

@Injectable()
export class UserTypeormRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  private qb() {
    return this.repo.createQueryBuilder(TABLE_ALIAS_USER);
  }

  private qbSelectedColumns(select?: UserSelectableColumns[]) {
    const qb = this.qb();

    if (select?.length) {
      qb.select(select.map((col) => `${TABLE_ALIAS_USER}.${col}`));
    }

    return qb;
  }

  save: IUserRepository['save'] = async (user) => {
    return await this.repo.save(user);
  };

  findOneById: IUserRepository['findOneById'] = async (id, select?) => {
    const qb = this.qbSelectedColumns(select);

    return qb.where(`${TABLE_ALIAS_USER}.id = :id`, { id }).getOne();
  };

  findOneByEmail: IUserRepository['findOneByEmail'] = async (
    email,
    select?,
  ) => {
    const qb = this.qbSelectedColumns(select);

    return await qb
      .where(`${TABLE_ALIAS_USER}.email = :email`, { email })
      .getOne();
  };

  findOneEqualBy: IUserRepository['findOneEqualBy'] = async (
    options,
    select?,
  ) => {
    const qb = this.qbSelectedColumns(select);

    Object.entries(options).forEach(([key, value]) => {
      qb.andWhere(`${TABLE_ALIAS_USER}.${key} = :${key}`, { [key]: value });
    });

    return await qb.getOne();
  };
}
