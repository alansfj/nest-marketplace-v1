import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Category,
  CategorySelectableColumns,
  TABLE_ALIAS_CATEGORY,
} from 'src/entities/category.entity';
import { ICategoryRepository } from 'src/types/category/category.repository.interface';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryTypeormRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  private qb() {
    return this.repo.createQueryBuilder(TABLE_ALIAS_CATEGORY);
  }

  private qbSelectedColumns(select?: CategorySelectableColumns[]) {
    const qb = this.qb();

    if (select?.length) {
      qb.select(select.map((col) => `${TABLE_ALIAS_CATEGORY}.${col}`));
    }

    return qb;
  }

  async save(category: Category): Promise<Category> {
    return await this.repo.save(category);
  }

  async findAll<T extends CategorySelectableColumns>(
    select?: T[],
  ): Promise<Pick<Category, T>[] | []> {
    const qb = this.qbSelectedColumns(select);

    return qb.getMany();
  }

  async findOneById<T extends CategorySelectableColumns>(
    id: number,
    select?: T[],
  ): Promise<Pick<Category, T> | null> {
    const qb = this.qbSelectedColumns(select);

    return qb.where(`${TABLE_ALIAS_CATEGORY}.id = :id`, { id }).getOne();
  }

  async findManyByIds<T extends CategorySelectableColumns>(
    ids: number[],
    select?: T[],
  ): Promise<Pick<Category, T>[] | []> {
    const qb = this.qbSelectedColumns(select);

    return qb
      .where(`${TABLE_ALIAS_CATEGORY}.id IN (:...ids)`, { ids })
      .getMany();
  }
}
