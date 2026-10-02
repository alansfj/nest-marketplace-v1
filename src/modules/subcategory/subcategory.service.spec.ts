import { BadRequestException } from '@nestjs/common';

import { ISubcategoryRepository } from 'src/types/subcategory/subcategory.repository.interface';
import { Subcategory } from 'src/entities/subcategory.entity';
import { SubcategoryService } from './subcategory.service';

describe('SubcategoryService.getSubcategoryFromId', () => {
  let repository: jest.Mocked<ISubcategoryRepository>;
  let service: SubcategoryService;

  beforeEach(() => {
    repository = {
      findOneByIdForUpdate: jest.fn(),
    } as unknown as jest.Mocked<ISubcategoryRepository>;

    service = new SubcategoryService(repository);
  });

  it('returns the subcategory when found', async () => {
    const subcategory = {
      __brand: 'Subcategory',
      id: 1,
    } as unknown as Subcategory;
    repository.findOneByIdForUpdate.mockResolvedValue(subcategory);

    await expect(service.getSubcategoryFromId(1)).resolves.toBe(subcategory);
  });

  it('throws when the subcategory does not exist', async () => {
    repository.findOneByIdForUpdate.mockResolvedValue(null);

    await expect(service.getSubcategoryFromId(999)).rejects.toThrow(
      BadRequestException,
    );
  });
});
