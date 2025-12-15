import {
  Category,
  CategorySelectableColumns,
} from 'src/entities/category.entity';

export abstract class ICategoryService {
  abstract getCategoriesForStoreCreation(): Promise<
    Pick<Category, CategorySelectableColumns>[]
  >;

  abstract validateCategoriesExistForStoreCreation(
    ids: number[],
  ): Promise<Category[]>;
}
