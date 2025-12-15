import {
  Category,
  CategorySelectableColumns,
} from 'src/entities/category.entity';

export abstract class ICategoryService {
  abstract findOneById<T extends CategorySelectableColumns>(
    id: number,
    select?: T[],
  ): Promise<Pick<Category, T> | null>;

  abstract findAll<T extends CategorySelectableColumns>(
    select?: T[],
  ): Promise<Pick<Category, T>[] | []>;

  abstract findManyByIdsReadOnly<T extends CategorySelectableColumns>(
    ids: number[],
    select: T[],
  ): Promise<Pick<Category, T>[]>;

  abstract findManyByIdsForUpdate(ids: number[]): Promise<Category[]>;

  abstract validateCategoriesExistReadOnly<T extends CategorySelectableColumns>(
    ids: number[],
    select?: T[],
  ): Promise<Pick<Category, T>[] | false>;

  abstract validateCategoriesExistForUpdate(
    ids: number[],
  ): Promise<Category[] | false>;
}
