import { Injectable } from '@nestjs/common';

import { Product } from 'src/entities/product.entity';
import { IProductService } from 'src/types/product/product.service.interface';
import { CreateProductDtoInput } from './dtos/create-product.dto.input';

@Injectable()
export class ProductService implements IProductService {
  createProduct(userId: number, dto: CreateProductDtoInput): Promise<Product> {
    throw new Error('Method not implemented.');
  }
}
