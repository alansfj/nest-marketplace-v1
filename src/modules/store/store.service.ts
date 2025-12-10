import { BadRequestException, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

import { IStoreService } from 'src/types/store/store.service.interface';
import { CreateStoreDtoInput } from './dtos/create-store.dto.input';
import { Store } from 'src/entities/store.entity';
import { ICategoryService } from 'src/types/category/category.service.interface';
import { IUserService } from 'src/types/user/user.service.interface';
import { IStoreRepository } from 'src/types/store/store.repository.interface';
import { User } from 'src/entities/user.entity';
import { Category } from 'src/entities/category.entity';

@Injectable()
export class StoreService implements IStoreService {
  constructor(
    private readonly storeRepository: IStoreRepository,
    private readonly categoryService: ICategoryService,
    private readonly userService: IUserService,
  ) {}

  @Transactional()
  async createStore(userId: number, dto: CreateStoreDtoInput): Promise<Store> {
    const user = await this.userService.findOneById(userId, [
      'id',
      'email',
      'firstName',
      'lastName',
    ]);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const validCategories = await this.categoryService.validateCategoriesExist(
      dto.categories,
      ['id', 'name'],
    );

    if (!validCategories) {
      throw new BadRequestException('Some categories are invalid');
    }

    const newStoreEntity = Store.create({
      name: dto.name,
      description: dto.description,
      user: user as User,
      categories: validCategories as Category[],
    });

    if (newStoreEntity.errors) {
      throw new BadRequestException(newStoreEntity.errors);
    }

    newStoreEntity.value.user = user as User;
    newStoreEntity.value.categories = validCategories as Category[];

    return await this.storeRepository.save(newStoreEntity.value);
  }
}
