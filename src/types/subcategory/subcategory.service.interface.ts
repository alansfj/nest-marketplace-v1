import { Subcategory } from 'src/entities/subcategory.entity';

export abstract class ISubcategoryService {
  abstract getSubcategoryFromId(id: number): Promise<Subcategory>;
}
