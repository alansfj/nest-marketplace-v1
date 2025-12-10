import {
  Category,
  CategorySelectableColumns,
} from 'src/entities/category.entity';

export abstract class ICategoryService {
  abstract findOneById<T extends CategorySelectableColumns>(
    id: number,
    select?: T[],
  ): Promise<Pick<Category, T> | null>;

  abstract findManyByIds<T extends CategorySelectableColumns>(
    ids: number[],
    select?: T[],
  ): Promise<Pick<Category, T>[] | []>;

  abstract validateCategoriesExist<T extends CategorySelectableColumns>(
    ids: number[],
    select?: T[],
  ): Promise<Pick<Category, T>[] | false>;
}
