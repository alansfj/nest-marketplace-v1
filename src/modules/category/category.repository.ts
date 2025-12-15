import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Category,
  CategorySelectableColumns,
  TABLE_ALIAS_CATEGORY,
} from 'src/entities/category.entity';
import { BaseTypeormRepository } from 'src/common/repositories/base-typeorm.repository';
import { ICategoryRepository } from 'src/types/category/category.repository.interface';

@Injectable()
export class CategoryTypeormRepository
  extends BaseTypeormRepository<Category, CategorySelectableColumns>
  implements ICategoryRepository
{
  protected readonly alias = TABLE_ALIAS_CATEGORY;

  constructor(
    @InjectRepository(Category)
    repo: Repository<Category>,
  ) {
    super(repo);
  }

  /* ============================
   * WRITE / FOR UPDATE
   * ============================ */

  async findAllForUpdate(): Promise<Category[]> {
    const qb = this.qb().setLock('pessimistic_write');
    return this.findAll(qb);
  }

  async findOneByIdForUpdate(id: number): Promise<Category | null> {
    const qb = this.qb().setLock('pessimistic_write');
    return this.findOneById(qb, id);
  }

  async findManyByIdsForUpdate(ids: number[]): Promise<Category[]> {
    const qb = this.qb().setLock('pessimistic_write');
    return this.findManyByIds(qb, ids);
  }

  /* ============================
   * READ ONLY
   * ============================ */

  async findAllReadOnly<T extends CategorySelectableColumns>(
    select: T[],
  ): Promise<Pick<Category, T>[]> {
    const qb = this.qbSelectedColumns(select);
    return this.findAll(qb);
  }

  async findOneByIdReadOnly<T extends CategorySelectableColumns>(
    id: number,
    select: T[],
  ): Promise<Pick<Category, T> | null> {
    const qb = this.qbSelectedColumns(select);
    return this.findOneById(qb, id);
  }

  async findManyByIdsReadOnly<T extends CategorySelectableColumns>(
    ids: number[],
    select: T[],
  ): Promise<Pick<Category, T>[]> {
    const qb = this.qbSelectedColumns(select);
    return this.findManyByIds(qb, ids);
  }
}
