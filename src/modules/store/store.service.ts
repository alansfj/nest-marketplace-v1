import { BadRequestException, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { IStoreService } from 'src/types/store/store.service.interface';
import { CreateStoreDtoInput } from './dtos/create-store.dto.input';
import { Store } from 'src/entities/store.entity';
import { ICategoryService } from 'src/types/category/category.service.interface';
import { IStoreRepository } from 'src/types/store/store.repository.interface';
import { User } from 'src/entities/user.entity';

@Injectable()
export class StoreService implements IStoreService {
  constructor(
    private readonly storeRepository: IStoreRepository,
    private readonly categoryService: ICategoryService,
  ) {}

  @Transactional()
  async createStore(user: User, dto: CreateStoreDtoInput): Promise<Store> {
    const validCategoriesEntities =
      await this.categoryService.validateCategoriesExistForUpdate(
        dto.categories,
      );

    if (!validCategoriesEntities) {
      throw new BadRequestException('Some categories are invalid');
    }

    const newStoreEntity = Store.create({
      name: dto.name,
      description: dto.description,
      user,
      categories: validCategoriesEntities,
    });

    return await this.storeRepository.save(newStoreEntity);
  }

  @Transactional()
  async validateStoreName(storeName: string): Promise<{ valid: boolean }> {
    const storeNameNormalized = Store.normalizeName(storeName);

    if (!storeNameNormalized) {
      throw new BadRequestException('a valid name is required');
    }

    const store = await this.storeRepository.findOneEqualBy(
      { nameNormalized: storeNameNormalized },
      ['id'],
    );

    if (store) return { valid: false };

    return { valid: true };
  }
}
