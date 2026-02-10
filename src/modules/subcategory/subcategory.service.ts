import { BadRequestException, Injectable } from '@nestjs/common';
import { Subcategory } from 'src/entities/subcategory.entity';
import { ISubcategoryRepository } from 'src/types/subcategory/subcategory.repository.interface';
import { ISubcategoryService } from 'src/types/subcategory/subcategory.service.interface';

@Injectable()
export class SubcategoryService implements ISubcategoryService {
  constructor(private readonly subcategoryRepository: ISubcategoryRepository) {}

  async getSubcategoryFromId(id: number): Promise<Subcategory> {
    const subcategory =
      await this.subcategoryRepository.findOneByIdForUpdate(id);

    if (subcategory) return subcategory;

    throw new BadRequestException('Subcategory not found');
  }
}
