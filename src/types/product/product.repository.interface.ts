import { Product } from 'src/entities/product.entity';
import { IBaseTypeormRepository } from '../base-typeorm.repository.interface';

export abstract class IProductRepository extends IBaseTypeormRepository<Product> {
  abstract findOneByIdWithOwner(id: number): Promise<Product | null>;
}
