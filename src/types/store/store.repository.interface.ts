import { Store } from 'src/entities/store.entity';
import { IBaseTypeormRepository } from '../base-typeorm.repository.interface';

export abstract class IStoreRepository extends IBaseTypeormRepository<Store> {}
