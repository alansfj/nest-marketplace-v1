import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class Store {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

@Exclude()
class Subcategory {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

@Exclude()
class ProductCatalogItemDtoOutput {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: string;

  @Expose()
  currency: string;

  @Expose()
  quantity: number;

  @Expose()
  createdDate: Date;

  @Expose()
  @Type(() => Store)
  store: Store;

  @Expose()
  @Type(() => Subcategory)
  subcategory: Subcategory;
}

@Exclude()
export class ListProductsDtoOutput {
  @Expose()
  total: number;

  @Expose()
  limit: number;

  @Expose()
  offset: number;

  @Expose()
  @Type(() => ProductCatalogItemDtoOutput)
  items: ProductCatalogItemDtoOutput[];
}
