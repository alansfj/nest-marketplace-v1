import { Store, StoreSelectableColumns } from 'src/entities/store.entity';
import { PrimitiveColumns } from '../selectable-columns.type';

export abstract class IStoreRepository {
  abstract save(user: Store): Promise<Store>;

  abstract findOneEqualBy<T extends StoreSelectableColumns>(
    options: Partial<Record<StoreSelectableColumns, PrimitiveColumns>>,
    select?: T[],
  ): Promise<Pick<Store, T> | null>;
}
