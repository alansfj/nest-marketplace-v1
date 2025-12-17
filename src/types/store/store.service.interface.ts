import { Store } from 'src/entities/store.entity';
import { CreateStoreDtoInput } from 'src/modules/store/dtos/create-store.dto.input';

export abstract class IStoreService {
  abstract createStore(
    userId: number,
    dto: CreateStoreDtoInput,
  ): Promise<Store>;

  abstract validateStoreName(storeName: string): Promise<{ valid: boolean }>;
}
