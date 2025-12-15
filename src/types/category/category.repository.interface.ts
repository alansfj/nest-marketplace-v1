import { Category } from 'src/entities/category.entity';
import { IBaseTypeormRepository } from '../base-typeorm.repository.interface';

export abstract class ICategoryRepository extends IBaseTypeormRepository<Category> {}
