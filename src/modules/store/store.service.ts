import { BadRequestException, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { IStoreService } from 'src/types/store/store.service.interface';
import { CreateStoreDtoInput } from './dtos/create-store.dto.input';
import { Store } from 'src/entities/store.entity';
import { ICategoryService } from 'src/types/category/category.service.interface';
import { IStoreRepository } from 'src/types/store/store.repository.interface';
import { IUserService } from 'src/types/user/user.service.interface';

@Injectable()
export class StoreService implements IStoreService {
  constructor(
    private readonly storeRepository: IStoreRepository,
    private readonly categoryService: ICategoryService,
    private readonly userService: IUserService,
  ) {}

  @Transactional()
  async createStore(userId: number, dto: CreateStoreDtoInput) {
    const [user, categories] = await Promise.all([
      this.userService.getUserFromId(userId),
      this.categoryService.validateCategoriesExistForStoreCreation(
        dto.categories,
      ),
    ]);

    const newStoreEntity = Store.create({
      name: dto.name,
      description: dto.description,
      user,
      categories,
    });

    return await this.storeRepository.save(newStoreEntity);
  }

  @Transactional()
  async validateStoreName(storeName: string) {
    const storeNameNormalized = Store.normalizeName(storeName);

    if (!storeNameNormalized) {
      throw new BadRequestException('a valid name is required');
    }

    const store = await this.storeRepository.findOneByEqualReadOnly(
      { nameNormalized: storeNameNormalized },
      ['id'],
    );

    if (store) return { valid: false };

    return { valid: true };
  }
}
