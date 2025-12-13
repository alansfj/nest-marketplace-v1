import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Store,
  StoreSelectableColumns,
  TABLE_ALIAS_STORE,
} from 'src/entities/store.entity';
import { IStoreRepository } from 'src/types/store/store.repository.interface';
import { PrimitiveColumns } from 'src/types/selectable-columns.type';

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

  async findOneEqualBy<T extends StoreSelectableColumns>(
    options: Partial<Record<StoreSelectableColumns, PrimitiveColumns>>,
    select?: T[],
  ): Promise<Pick<Store, T> | null> {
    const qb = this.qbSelectedColumns(select);

    Object.entries(options).forEach(([key, value]) => {
      qb.andWhere(`${TABLE_ALIAS_STORE}.${key} = :${key}`, { [key]: value });
    });

    return await qb.getOne();
  }
}
