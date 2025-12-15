import { Store } from 'src/entities/store.entity';
import { IBaseTypeormRepository } from '../base-typeorm.repository.interface';

export abstract class IStoreRepository extends IBaseTypeormRepository<Store> {
  // abstract findOneEqualBy<T extends StoreSelectableColumns>(
  //   options: Partial<Record<StoreSelectableColumns, PrimitiveColumns>>,
  //   select?: T[],
  // ): Promise<Pick<Store, T> | null>;
}
