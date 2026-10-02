import { BadRequestException } from '@nestjs/common';

import { ICategoryService } from 'src/types/category/category.service.interface';
import { IStoreRepository } from 'src/types/store/store.repository.interface';
import { IUserService } from 'src/types/user/user.service.interface';
import { Category } from 'src/entities/category.entity';
import { Store } from 'src/entities/store.entity';
import { User } from 'src/entities/user.entity';

// createStore/validateStoreName are decorated with @Transactional(), which
// needs a real, initialized DataSource. See order.service.spec.ts for why
// this is mocked as a pass-through here.
jest.mock('typeorm-transactional', () => ({
  ...jest.requireActual('typeorm-transactional'),
  Transactional:
    () => (_target: unknown, _key: string, descriptor: PropertyDescriptor) =>
      descriptor,
}));

import { StoreService } from './store.service';

function buildStore(overrides: Partial<Store> = {}): Store {
  return {
    __brand: 'Store',
    id: 1,
    name: 'My Store',
    nameNormalized: 'my-store',
    ...overrides,
  } as unknown as Store;
}

describe('StoreService', () => {
  let storeRepository: jest.Mocked<IStoreRepository>;
  let categoryService: jest.Mocked<ICategoryService>;
  let userService: jest.Mocked<IUserService>;
  let service: StoreService;

  beforeEach(() => {
    storeRepository = {
      findOneByIdForUpdate: jest.fn(),
      findOneByEqualReadOnly: jest.fn(),
      save: jest.fn((entity) => Promise.resolve(entity)),
    } as unknown as jest.Mocked<IStoreRepository>;
    categoryService = {
      validateCategoriesExistForStoreCreation: jest.fn(),
    } as unknown as jest.Mocked<ICategoryService>;
    userService = {
      getUserFromId: jest.fn(),
    } as unknown as jest.Mocked<IUserService>;

    service = new StoreService(storeRepository, categoryService, userService);
  });

  describe('getStoreFromId', () => {
    it('returns the store when found', async () => {
      const store = buildStore();
      storeRepository.findOneByIdForUpdate.mockResolvedValue(store);

      await expect(service.getStoreFromId(1)).resolves.toBe(store);
    });

    it('throws when the store is not found', async () => {
      storeRepository.findOneByIdForUpdate.mockResolvedValue(null);

      await expect(service.getStoreFromId(999)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('createStore', () => {
    it('resolves the owner and categories, then saves the new store', async () => {
      const user = { __brand: 'User', id: 1 } as unknown as User;
      const categories = [
        { __brand: 'Category', id: 1 } as unknown as Category,
      ];
      userService.getUserFromId.mockResolvedValue(user);
      categoryService.validateCategoriesExistForStoreCreation.mockResolvedValue(
        categories,
      );

      const dto = { name: 'My Store', description: 'desc', categories: [1] };
      const result = await service.createStore(1, dto);

      expect(
        categoryService.validateCategoriesExistForStoreCreation,
      ).toHaveBeenCalledWith([1]);
      expect(storeRepository.save).toHaveBeenCalledTimes(1);
      expect(result.name).toBe('My Store');
      expect(result.nameNormalized).toBe('my-store');
      expect(result.user).toBe(user);
      expect(result.categories).toBe(categories);
    });
  });

  describe('validateStoreName', () => {
    it('rejects a name that normalizes to an empty string', async () => {
      await expect(service.validateStoreName('!!!')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('is invalid when a store with that normalized name already exists', async () => {
      storeRepository.findOneByEqualReadOnly.mockResolvedValue({
        id: 1,
      } as any);

      const result = await service.validateStoreName('My Store');

      expect(storeRepository.findOneByEqualReadOnly).toHaveBeenCalledWith(
        { nameNormalized: 'my-store' },
        ['id'],
      );
      expect(result).toEqual({ valid: false });
    });

    it('is valid when no store has that normalized name yet', async () => {
      storeRepository.findOneByEqualReadOnly.mockResolvedValue(null);

      const result = await service.validateStoreName('My Store');

      expect(result).toEqual({ valid: true });
    });
  });
});
