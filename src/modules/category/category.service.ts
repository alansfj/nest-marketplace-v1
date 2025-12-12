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

  async findManyByIds<T extends CategorySelectableColumns>(
    ids: number[],
    select?: T[],
  ): Promise<Pick<Category, T>[] | []> {
    return await this.categoryRepository.findManyByIds(ids, select);
  }

  async validateCategoriesExist<T extends CategorySelectableColumns>(
    ids: number[],
    select?: T[],
  ): Promise<Pick<Category, T>[] | false> {
    if (!ids.length) return false;

    const categories = await this.findManyByIds(ids, select);

    if (ids.length === categories.length) return categories;

    return false;
  }
}
