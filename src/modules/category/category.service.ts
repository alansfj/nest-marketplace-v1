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

  private async validateEntitiesExist<T>(
    ids: number[],
    finder: () => Promise<T[]>,
  ): Promise<T[] | false> {
    if (!ids.length) return false;

    const entities = await finder();

    return ids.length === entities.length ? entities : false;
  }

  // ForUpdate

  async findAllForUpdate(): Promise<Category[]> {
    return await this.categoryRepository.findAllForUpdate();
  }

  async findOneByIdForUpdate(id: number): Promise<Category | null> {
    return await this.categoryRepository.findOneByIdForUpdate(id);
  }

  async findManyByIdsForUpdate(ids: number[]): Promise<Category[]> {
    return await this.categoryRepository.findManyByIdsForUpdate(ids);
  }

  async validateCategoriesExistForUpdate(
    ids: number[],
  ): Promise<Category[] | false> {
    return this.validateEntitiesExist(ids, () =>
      this.findManyByIdsForUpdate(ids),
    );
  }

  // ReadOnly

  async findAllReadOnly<T extends CategorySelectableColumns>(
    select: T[],
  ): Promise<Pick<Category, T>[]> {
    return await this.categoryRepository.findAllReadOnly(select);
  }

  async findOneByIdReadOnly<T extends CategorySelectableColumns>(
    id: number,
    select: T[],
  ): Promise<Pick<Category, T> | null> {
    return await this.categoryRepository.findOneByIdReadOnly(id, select);
  }

  async findManyByIdsReadOnly<T extends CategorySelectableColumns>(
    ids: number[],
    select: T[],
  ): Promise<Pick<Category, T>[]> {
    return await this.categoryRepository.findManyByIdsReadOnly(ids, select);
  }

  async validateCategoriesExistReadOnly<T extends CategorySelectableColumns>(
    ids: number[],
    select: T[],
  ): Promise<Pick<Category, T>[] | false> {
    return this.validateEntitiesExist(ids, () =>
      this.findManyByIdsReadOnly(ids, select),
    );
  }
}
