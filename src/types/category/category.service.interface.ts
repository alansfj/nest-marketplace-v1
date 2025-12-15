import {
  Category,
  CategorySelectableColumns,
} from 'src/entities/category.entity';

export abstract class ICategoryService {
  // ForUpdate

  abstract findAllForUpdate(): Promise<Category[]>;

  abstract findOneByIdForUpdate(id: number): Promise<Category | null>;

  abstract findManyByIdsForUpdate(ids: number[]): Promise<Category[]>;

  abstract validateCategoriesExistForUpdate(
    ids: number[],
  ): Promise<Category[] | false>;

  // ReadOnly

  abstract findOneByIdReadOnly<T extends CategorySelectableColumns>(
    id: number,
    select: T[],
  ): Promise<Pick<Category, T> | null>;

  abstract findAllReadOnly<T extends CategorySelectableColumns>(
    select: T[],
  ): Promise<Pick<Category, T>[] | []>;

  abstract findManyByIdsReadOnly<T extends CategorySelectableColumns>(
    ids: number[],
    select: T[],
  ): Promise<Pick<Category, T>[]>;

  abstract validateCategoriesExistReadOnly<T extends CategorySelectableColumns>(
    ids: number[],
    select: T[],
  ): Promise<Pick<Category, T>[] | false>;
}
