import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseTypeormRepository } from 'src/common/repositories/base-typeorm.repository';
import { Product, TABLE_ALIAS_PRODUCT } from 'src/entities/product.entity';
import { IProductRepository } from 'src/types/product/product.repository.interface';

@Injectable()
export class ProductTypeormRepository
  extends BaseTypeormRepository<Product>
  implements IProductRepository
{
  protected readonly alias = TABLE_ALIAS_PRODUCT;

  constructor(
    @InjectRepository(Product)
    repo: Repository<Product>,
  ) {
    super(repo);
  }

  async findOneByIdForUpdateWithOwner(id: number): Promise<Product | null> {
    return await this.qb()
      .leftJoinAndSelect(`${this.alias}.user`, 'user')
      // Postgres can't lock the nullable side of an outer join, so scope
      // the lock to this table only. The alias must be quoted here since
      // TypeORM inserts lockTables verbatim and Postgres folds unquoted
      // identifiers to lowercase, which wouldn't match our uppercase alias.
      .setLock('pessimistic_write', undefined, [`"${this.alias}"`])
      .where(`${this.alias}.id = :id`, { id })
      .getOne();
  }
}
