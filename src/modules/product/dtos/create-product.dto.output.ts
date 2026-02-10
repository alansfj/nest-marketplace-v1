import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class User {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;
}

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
export class CreateProductDtoOutput {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  currency: string;

  @Expose()
  quantity: number;

  @Expose()
  createdDate: Date;

  @Expose()
  @Type(() => User)
  user: User;

  @Expose()
  @Type(() => Store)
  store: Store;

  @Expose()
  @Type(() => Subcategory)
  subcategory: Subcategory;
}
