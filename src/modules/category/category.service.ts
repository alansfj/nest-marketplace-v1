import { Injectable } from '@nestjs/common';

import {
  CategorySelectableColumns,
  Category,
} from 'src/entities/category.entity';
import { ICategoryRepository } from 'src/types/category/category.repository.interface';
import { ICategoryService } from 'src/types/category/category.service.interface';

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async findAll<T extends CategorySelectableColumns>(
    select?: T[],
  ): Promise<Pick<Category, T>[] | []> {
    return await this.categoryRepository.findAll(select);
  }

  async findOneById<T extends CategorySelectableColumns>(
    id: number,
    select?: T[],
  ): Promise<Pick<Category, T> | null> {
    return await this.categoryRepository.findOneById(id, select);
  }

  async findManyByIdsReadOnly<T extends CategorySelectableColumns>(
    ids: number[],
    select: T[],
  ): Promise<Pick<Category, T>[]> {
    return await this.categoryRepository.findManyByIdsReadOnly(ids, select);
  }

  async findManyByIdsForUpdate(ids: number[]): Promise<Category[]> {
    return await this.categoryRepository.findManyByIdsForUpdate(ids);
  }

  private async validateEntitiesExist<T>(
    ids: number[],
    finder: () => Promise<T[]>,
  ): Promise<T[] | false> {
    if (!ids.length) return false;

    const entities = await finder();

    return ids.length === entities.length ? entities : false;
  }

  async validateCategoriesExistReadOnly<T extends CategorySelectableColumns>(
    ids: number[],
    select: T[],
  ): Promise<Pick<Category, T>[] | false> {
    return this.validateEntitiesExist(ids, () =>
      this.findManyByIdsReadOnly(ids, select),
    );
  }

  async validateCategoriesExistForUpdate(
    ids: number[],
  ): Promise<Category[] | false> {
    return this.validateEntitiesExist(ids, () =>
      this.findManyByIdsForUpdate(ids),
    );
  }
}
