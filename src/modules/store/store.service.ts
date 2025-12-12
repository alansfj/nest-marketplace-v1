import { BadRequestException, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { IStoreService } from 'src/types/store/store.service.interface';
import { CreateStoreDtoInput } from './dtos/create-store.dto.input';
import { Store } from 'src/entities/store.entity';
import { ICategoryService } from 'src/types/category/category.service.interface';
import { IStoreRepository } from 'src/types/store/store.repository.interface';
import { User } from 'src/entities/user.entity';
import { Category } from 'src/entities/category.entity';

@Injectable()
export class StoreService implements IStoreService {
  constructor(
    private readonly storeRepository: IStoreRepository,
    private readonly categoryService: ICategoryService,
  ) {}

  @Transactional()
  async createStore(user: User, dto: CreateStoreDtoInput): Promise<Store> {
    const validCategoriesEntities =
      await this.categoryService.validateCategoriesExist(dto.categories, [
        'id',
        'name',
      ]);

    if (!validCategoriesEntities) {
      throw new BadRequestException('Some categories are invalid');
    }

    const newStoreEntity = Store.create({
      name: dto.name,
      description: dto.description,
      user,
      categories: validCategoriesEntities as Category[],
    });

    return await this.storeRepository.save(newStoreEntity);
  }
}
