import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Store,
  StoreSelectableColumns,
  TABLE_ALIAS_STORE,
} from 'src/entities/store.entity';
import { IStoreRepository } from 'src/types/store/store.repository.interface';

@Injectable()
export class StoreTypeormRepository implements IStoreRepository {
  constructor(
    @InjectRepository(Store)
    private repo: Repository<Store>,
  ) {}

  private qb() {
    return this.repo.createQueryBuilder(TABLE_ALIAS_STORE);
  }

  private qbSelectedColumns(select?: StoreSelectableColumns[]) {
    const qb = this.qb();

    if (select?.length) {
      qb.select(select.map((col) => `${TABLE_ALIAS_STORE}.${col}`));
    }

    return qb;
  }

  async save(store: Store): Promise<Store> {
    return await this.repo.save(store);
  }
}
