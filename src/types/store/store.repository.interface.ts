import { Store } from 'src/entities/store.entity';

export abstract class IStoreRepository {
  abstract save(user: Store): Promise<Store>;
}
