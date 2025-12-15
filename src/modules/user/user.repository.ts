import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, TABLE_ALIAS_USER } from 'src/entities/user.entity';
import { IUserRepository } from 'src/types/user/user.repository.interface';
import { BaseTypeormRepository } from 'src/common/repositories/base-typeorm.repository';

@Injectable()
export class UserTypeormRepository
  extends BaseTypeormRepository<User>
  implements IUserRepository
{
  protected readonly alias = TABLE_ALIAS_USER;

  constructor(
    @InjectRepository(User)
    repo: Repository<User>,
  ) {
    super(repo);
  }
}
