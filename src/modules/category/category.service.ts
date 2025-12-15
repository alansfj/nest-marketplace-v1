import { BadRequestException, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { ICategoryRepository } from 'src/types/category/category.repository.interface';
import { ICategoryService } from 'src/types/category/category.service.interface';

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async getCategoriesForStoreCreation() {
    return await this.categoryRepository.findAllReadOnly(['id', 'name']);
  }

  @Transactional()
  async validateCategoriesExistForStoreCreation(ids: number[]) {
    if (!ids.length) {
      throw new BadRequestException('Categories required');
    }

    const categories =
      await this.categoryRepository.findManyByIdsForUpdate(ids);

    if (ids.length !== categories.length) {
      throw new BadRequestException('Some categories are invalid');
    }

    return categories;
  }
}
