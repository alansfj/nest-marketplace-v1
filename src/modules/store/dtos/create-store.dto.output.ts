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
class Category {
  @Expose()
  id: number;

  @Expose()
  name: string;
}

@Exclude()
export class CreateStoreDtoOutput {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  createdDate: Date;

  @Expose()
  @Type(() => User)
  user: User;

  @Expose()
  @Type(() => Category)
  categories: Category[];
}
