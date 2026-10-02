import { BadRequestException } from '@nestjs/common';

import { ICategoryRepository } from 'src/types/category/category.repository.interface';
import { Category } from 'src/entities/category.entity';

// validateCategoriesExistForStoreCreation is decorated with
// @Transactional(), which needs a real, initialized DataSource. See
// order.service.spec.ts for why this is mocked as a pass-through here.
jest.mock('typeorm-transactional', () => ({
  ...jest.requireActual('typeorm-transactional'),
  Transactional:
    () => (_target: unknown, _key: string, descriptor: PropertyDescriptor) =>
      descriptor,
}));

import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let repository: jest.Mocked<ICategoryRepository>;
  let service: CategoryService;

  beforeEach(() => {
    repository = {
      findAllReadOnly: jest.fn(),
      findManyByIdsForUpdate: jest.fn(),
    } as unknown as jest.Mocked<ICategoryRepository>;

    service = new CategoryService(repository);
  });

  describe('getCategoriesForStoreCreation', () => {
    it('returns only the id and name columns', async () => {
      const categories = [{ id: 1, name: 'Electronics' }];
      repository.findAllReadOnly.mockResolvedValue(categories as any);

      await expect(service.getCategoriesForStoreCreation()).resolves.toBe(
        categories,
      );
      expect(repository.findAllReadOnly).toHaveBeenCalledWith(['id', 'name']);
    });
  });

  describe('validateCategoriesExistForStoreCreation', () => {
    it('rejects an empty list of ids', async () => {
      await expect(
        service.validateCategoriesExistForStoreCreation([]),
      ).rejects.toThrow(BadRequestException);
      expect(repository.findManyByIdsForUpdate).not.toHaveBeenCalled();
    });

    it('returns the categories when every id exists', async () => {
      const categories = [
        { __brand: 'Category', id: 1 },
        { __brand: 'Category', id: 2 },
      ] as unknown as Category[];
      repository.findManyByIdsForUpdate.mockResolvedValue(categories);

      await expect(
        service.validateCategoriesExistForStoreCreation([1, 2]),
      ).resolves.toBe(categories);
    });

    it('rejects when some of the given ids do not exist', async () => {
      repository.findManyByIdsForUpdate.mockResolvedValue([
        { __brand: 'Category', id: 1 },
      ] as unknown as Category[]);

      await expect(
        service.validateCategoriesExistForStoreCreation([1, 999]),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
