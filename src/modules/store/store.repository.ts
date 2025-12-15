import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Store, TABLE_ALIAS_STORE } from 'src/entities/store.entity';
import { IStoreRepository } from 'src/types/store/store.repository.interface';
import { BaseTypeormRepository } from 'src/common/repositories/base-typeorm.repository';

@Injectable()
export class StoreTypeormRepository
  extends BaseTypeormRepository<Store>
  implements IStoreRepository
{
  protected readonly alias = TABLE_ALIAS_STORE;

  constructor(
    @InjectRepository(Store)
    repo: Repository<Store>,
  ) {
    super(repo);
  }
}
