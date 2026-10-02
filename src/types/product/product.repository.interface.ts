import { Product } from 'src/entities/product.entity';
import { IBaseTypeormRepository } from '../base-typeorm.repository.interface';

export abstract class IProductRepository extends IBaseTypeormRepository<Product> {
  abstract findOneByIdForUpdateWithOwner(id: number): Promise<Product | null>;

  abstract findAllPaginatedWithRelations(options: {
    limit: number;
    offset: number;
  }): Promise<{ items: Product[]; total: number }>;
}
