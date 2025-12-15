import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category, TABLE_ALIAS_CATEGORY } from 'src/entities/category.entity';
import { BaseTypeormRepository } from 'src/common/repositories/base-typeorm.repository';
import { ICategoryRepository } from 'src/types/category/category.repository.interface';

@Injectable()
export class CategoryTypeormRepository
  extends BaseTypeormRepository<Category>
  implements ICategoryRepository
{
  protected readonly alias = TABLE_ALIAS_CATEGORY;

  constructor(
    @InjectRepository(Category)
    repo: Repository<Category>,
  ) {
    super(repo);
  }
}
