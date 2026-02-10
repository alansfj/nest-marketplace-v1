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

  async findOneByIdWithOwner(id: number): Promise<Product | null> {
    return await this.qb()
      .leftJoinAndSelect(`${this.alias}.user`, 'user')
      .where(`${this.alias}.id = :id`, { id })
      .getOne();
  }
}
