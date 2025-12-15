import {
  Category,
  CategorySelectableColumns,
} from 'src/entities/category.entity';

export abstract class ICategoryRepository {
  abstract findAllForUpdate(): Promise<Category[]>;

  abstract findAllReadOnly<T extends CategorySelectableColumns>(
    select: T[],
  ): Promise<Pick<Category, T>[]>;

  abstract findOneByIdForUpdate(id: number): Promise<Category | null>;

  abstract findOneByIdReadOnly<T extends CategorySelectableColumns>(
    id: number,
    select: T[],
  ): Promise<Pick<Category, T> | null>;

  abstract findManyByIdsForUpdate(ids: number[]): Promise<Category[]>;

  abstract findManyByIdsReadOnly<T extends CategorySelectableColumns>(
    ids: number[],
    select: T[],
  ): Promise<Pick<Category, T>[]>;
}
