import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Subcategory,
  TABLE_ALIAS_SUBCATEGORY,
} from 'src/entities/subcategory.entity';
import { BaseTypeormRepository } from 'src/common/repositories/base-typeorm.repository';
import { ISubcategoryRepository } from 'src/types/subcategory/subcategory.repository.interface';

@Injectable()
export class SubcategoryTypeormRepository
  extends BaseTypeormRepository<Subcategory>
  implements ISubcategoryRepository
{
  protected readonly alias = TABLE_ALIAS_SUBCATEGORY;

  constructor(
    @InjectRepository(Subcategory)
    repo: Repository<Subcategory>,
  ) {
    super(repo);
  }
}
