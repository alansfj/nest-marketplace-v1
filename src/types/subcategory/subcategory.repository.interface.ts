import { Subcategory } from 'src/entities/subcategory.entity';
import { IBaseTypeormRepository } from '../base-typeorm.repository.interface';

export abstract class ISubcategoryRepository extends IBaseTypeormRepository<Subcategory> {}
