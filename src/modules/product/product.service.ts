import { Injectable } from '@nestjs/common';

import { Product } from 'src/entities/product.entity';
import { IProductService } from 'src/types/product/product.service.interface';
import { CreateProductDtoInput } from './dtos/create-product.dto.input';
import { IProductRepository } from 'src/types/product/product.repository.interface';
import { ISubcategoryService } from 'src/types/subcategory/subcategory.service.interface';
import { IUserService } from 'src/types/user/user.service.interface';
import { IStoreService } from 'src/types/store/store.service.interface';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly subcategoryService: ISubcategoryService,
    private readonly userService: IUserService,
    private readonly storeService: IStoreService,
  ) {}

  @Transactional()
  async createProduct(
    userId: number,
    dto: CreateProductDtoInput,
  ): Promise<Product> {
    const [user, subcategory, store] = await Promise.all([
      this.userService.getUserFromId(userId),
      this.subcategoryService.getSubcategoryFromId(dto.subcategory),
      this.storeService.getStoreFromId(dto.store),
    ]);

    const newProductEntity = Product.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      currency: dto.currency,
      quantity: dto.quantity,
      user,
      store,
      subcategory,
    });

    return await this.productRepository.save(newProductEntity);
  }
}
