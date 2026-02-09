import { Product } from 'src/entities/product.entity';
import { CreateProductDtoInput } from 'src/modules/product/dtos/create-product.dto.input';

export abstract class IProductService {
  abstract createProduct(
    userId: number,
    dto: CreateProductDtoInput,
  ): Promise<Product>;
}
