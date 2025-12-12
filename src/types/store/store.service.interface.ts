import { Store } from 'src/entities/store.entity';
import { User } from 'src/entities/user.entity';
import { CreateStoreDtoInput } from 'src/modules/store/dtos/create-store.dto.input';

export abstract class IStoreService {
  abstract createStore(user: User, dto: CreateStoreDtoInput): Promise<Store>;
}
