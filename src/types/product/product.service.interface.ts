import { Product } from 'src/entities/product.entity';
import { CreateProductDtoInput } from 'src/modules/product/dtos/create-product.dto.input';
import { ListProductsDtoInput } from 'src/modules/product/dtos/list-products.dto.input';

export abstract class IProductService {
  abstract getProductFromId(id: number): Promise<Product>;

  abstract getProductByIdWithOwner(id: number): Promise<Product>;

  abstract createProduct(
    userId: number,
    dto: CreateProductDtoInput,
  ): Promise<Product>;

  abstract listProducts(dto: ListProductsDtoInput): Promise<{
    items: Product[];
    total: number;
    limit: number;
    offset: number;
  }>;
}
