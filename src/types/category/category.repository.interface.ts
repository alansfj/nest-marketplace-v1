import {
  Category,
  CategorySelectableColumns,
} from 'src/entities/category.entity';

export abstract class ICategoryRepository {
  abstract save(user: Category): Promise<Category>;

  abstract findAll<T extends CategorySelectableColumns>(
    select?: T[],
  ): Promise<Pick<Category, T>[] | []>;

  abstract findOneById<T extends CategorySelectableColumns>(
    id: number,
    select?: T[],
  ): Promise<Pick<Category, T> | null>;

  abstract findManyByIds<T extends CategorySelectableColumns>(
    ids: number[],
    select?: T[],
  ): Promise<Pick<Category, T>[] | []>;
}
